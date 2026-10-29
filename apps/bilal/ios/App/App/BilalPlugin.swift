import Foundation
import UIKit
import Capacitor
import UserNotifications
import AVFoundation
import CoreLocation

/// جسر الواجهة (JS) بنظام iOS: جدولة إشعارات الأذان المحلية، الحالة، الإعدادات، التجربة، واتجاه القبلة.
/// حدود iOS: 64 إشعاراً معلّقاً كحد أقصى، وصوت الإشعار 30 ثانية كحد أقصى؛ لذا يُجدول الأقرب 60 ويُعاد الجدول كلما فُتح التطبيق.
@objc(BilalPlugin)
public class BilalPlugin: CAPPlugin, CAPBridgedPlugin, CLLocationManagerDelegate, UNUserNotificationCenterDelegate {
    public let identifier = "BilalPlugin"
    public let jsName = "Bilal"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "schedule", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "status", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openSettings", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestNotifications", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setBars", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "preview", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stop", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openApp", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isInstalled", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "declination", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openUrl", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startHeading", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopHeading", returnType: CAPPluginReturnPromise)
    ]

    private var player: AVAudioPlayer?
    private var lm: CLLocationManager?
    private let maxPending = 60

    public override func load() {
        UNUserNotificationCenter.current().delegate = self
        installSounds()
    }

    // MARK: - الأصوات

    private var soundsDir: URL? { Bundle.main.url(forResource: "snd", withExtension: nil, subdirectory: "public") }

    /// أصوات الإشعارات يجب أن تكون في Library/Sounds أو جذر الحزمة؛ ننسخها من مجلد الواجهة عند التشغيل.
    private func installSounds() {
        guard let src = soundsDir, let lib = FileManager.default.urls(for: .libraryDirectory, in: .userDomainMask).first else { return }
        let dst = lib.appendingPathComponent("Sounds", isDirectory: true)
        try? FileManager.default.createDirectory(at: dst, withIntermediateDirectories: true)
        let files = (try? FileManager.default.contentsOfDirectory(atPath: src.path)) ?? []
        for f in files where f.hasPrefix("n_") {
            let to = dst.appendingPathComponent(f)
            let from = src.appendingPathComponent(f)
            let a = fileSize(from), b = fileSize(to)
            if a != b {
                try? FileManager.default.removeItem(at: to)
                try? FileManager.default.copyItem(at: from, to: to)
            }
        }
    }

    private func fileSize(_ u: URL) -> Int {
        let attrs = try? FileManager.default.attributesOfItem(atPath: u.path)
        return (attrs?[.size] as? Int) ?? -1
    }

    private func num(_ v: Any?) -> Double? {
        if let d = v as? Double { return d }
        if let i = v as? Int { return Double(i) }
        if let n = v as? NSNumber { return n.doubleValue }
        return nil
    }

    // MARK: - الجدولة

    @objc func schedule(_ call: CAPPluginCall) {
        let items = call.getArray("items", JSObject.self) ?? []
        let sound = call.getString("sound") ?? "takbir_haram"
        UserDefaults.standard.set(sound, forKey: "sound")
        let center = UNUserNotificationCenter.current()
        center.removeAllPendingNotificationRequests()
        let nowMs = Date().timeIntervalSince1970 * 1000
        let upcoming = items.compactMap { it -> (Double, JSObject)? in
            guard let t = num(it["t"]), t > nowMs + 1000 else { return nil }
            let k = it["k"] as? String ?? ""
            return (k == "p" || k == "imsak" || k == "sun") ? (t, it) : nil
        }.sorted { $0.0 < $1.0 }.prefix(maxPending)
        let cal = Calendar.current
        for (t, it) in upcoming {
            let k = it["k"] as? String ?? "p"
            let label = it["l"] as? String ?? ""
            let adhan = (num(it["a"]) ?? 0) > 0
            let c = UNMutableNotificationContent()
            switch k {
            case "imsak": c.title = label; c.body = "أذان بلال"
            case "sun": c.title = "حان وقت الشروق"; c.body = "أذان بلال"
            default: c.title = "حان وقت صلاة \(label)"; c.body = "حيّ على الصلاة"
            }
            c.sound = (adhan && k == "p") ? UNNotificationSound(named: UNNotificationSoundName("n_\(sound).caf")) : .default
            c.userInfo = ["a": adhan && k == "p" ? 1 : 0, "sound": sound]
            let comps = cal.dateComponents([.year, .month, .day, .hour, .minute], from: Date(timeIntervalSince1970: t / 1000))
            let req = UNNotificationRequest(identifier: "bilal-\(Int64(t))", content: c,
                                            trigger: UNCalendarNotificationTrigger(dateMatching: comps, repeats: false))
            center.add(req, withCompletionHandler: nil)
        }
        call.resolve()
    }

    // الإشعار وصل والتطبيق مفتوح: يُشغَّل الأذان كاملاً داخل التطبيق بدل مقطع الإشعار
    public func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification,
                                       withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
        let ui = notification.request.content.userInfo
        if (ui["a"] as? Int) == 1, let s = ui["sound"] as? String, playFull(s) {
            completionHandler([.banner, .list])
        } else {
            completionHandler([.banner, .list, .sound])
        }
    }

    public func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse,
                                       withCompletionHandler completionHandler: @escaping () -> Void) {
        completionHandler()
    }

    @discardableResult
    private func playFull(_ sound: String) -> Bool {
        guard let dir = soundsDir else { return false }
        let full = dir.appendingPathComponent("full_\(sound).m4a")
        let short = dir.appendingPathComponent("n_\(sound).caf")
        let url = FileManager.default.fileExists(atPath: full.path) ? full : short
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default, options: [])
            try AVAudioSession.sharedInstance().setActive(true)
            player = try AVAudioPlayer(contentsOf: url)
            player?.play()
            return true
        } catch { return false }
    }

    @objc func preview(_ call: CAPPluginCall) {
        let s = call.getString("sound") ?? UserDefaults.standard.string(forKey: "sound") ?? "takbir_haram"
        DispatchQueue.main.async { [weak self] in
            if self?.playFull(s) == true { call.resolve() } else { call.reject("تعذّر تشغيل الصوت") }
        }
    }

    @objc func stop(_ call: CAPPluginCall) {
        DispatchQueue.main.async { [weak self] in self?.player?.stop(); self?.player = nil; call.resolve() }
    }

    // MARK: - الحالة والأذونات

    @objc func status(_ call: CAPPluginCall) {
        UNUserNotificationCenter.current().getNotificationSettings { s in
            let ok = s.authorizationStatus == .authorized || s.authorizationStatus == .provisional
            call.resolve(["notifications": ok, "exact": true, "dnd": true, "battery": true, "sdk": 0, "ios": true])
        }
    }

    @objc func requestNotifications(_ call: CAPPluginCall) {
        let center = UNUserNotificationCenter.current()
        center.getNotificationSettings { s in
            if s.authorizationStatus == .denied {
                DispatchQueue.main.async {
                    if let u = URL(string: UIApplication.openSettingsURLString) { UIApplication.shared.open(u) }
                    call.resolve()
                }
            } else {
                center.requestAuthorization(options: [.alert, .sound, .badge]) { _, _ in call.resolve() }
            }
        }
    }

    @objc func openSettings(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            if let u = URL(string: UIApplication.openSettingsURLString) { UIApplication.shared.open(u) }
            call.resolve()
        }
    }

    // MARK: - المظهر وفتح الروابط

    private func color(_ hex: String) -> UIColor {
        var h = hex.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
        if h.count == 3 { h = h.map { "\($0)\($0)" }.joined() }
        var v: UInt64 = 0
        Scanner(string: h).scanHexInt64(&v)
        return UIColor(red: CGFloat((v >> 16) & 255) / 255, green: CGFloat((v >> 8) & 255) / 255, blue: CGFloat(v & 255) / 255, alpha: 1)
    }

    @objc func setBars(_ call: CAPPluginCall) {
        let top = color(call.getString("top") ?? "#120d08")
        DispatchQueue.main.async { [weak self] in
            self?.bridge?.viewController?.view.backgroundColor = top
            self?.bridge?.webView?.backgroundColor = top
            self?.bridge?.webView?.scrollView.backgroundColor = top
            call.resolve()
        }
    }

    @objc func openUrl(_ call: CAPPluginCall) {
        guard let s = call.getString("url"), let u = URL(string: s) else { call.reject("رابط غير صالح"); return }
        DispatchQueue.main.async { UIApplication.shared.open(u); call.resolve() }
    }

    @objc func openApp(_ call: CAPPluginCall) {
        guard let s = call.getString("url"), let u = URL(string: s) else { call.reject("تعذّر الفتح"); return }
        DispatchQueue.main.async { UIApplication.shared.open(u); call.resolve(["opened": "web"]) }
    }

    @objc func isInstalled(_ call: CAPPluginCall) { call.resolve(["installed": false]) }

    // MARK: - القبلة (اتجاه حقيقي من النظام؛ لذا لا انحراف إضافي)

    @objc func declination(_ call: CAPPluginCall) { call.resolve(["deg": 0]) }

    @objc func startHeading(_ call: CAPPluginCall) {
        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            let m = self.lm ?? CLLocationManager()
            self.lm = m
            m.delegate = self
            m.headingFilter = 1
            if m.authorizationStatus == .notDetermined { m.requestWhenInUseAuthorization() }
            m.startUpdatingLocation()   // لازم ليُحسب الاتجاه الحقيقي (trueHeading)
            if CLLocationManager.headingAvailable() { m.startUpdatingHeading() }
            call.resolve()
        }
    }

    @objc func stopHeading(_ call: CAPPluginCall) {
        DispatchQueue.main.async { [weak self] in
            self?.lm?.stopUpdatingHeading(); self?.lm?.stopUpdatingLocation(); call.resolve()
        }
    }

    public func locationManager(_ manager: CLLocationManager, didUpdateHeading newHeading: CLHeading) {
        let deg = newHeading.trueHeading >= 0 ? newHeading.trueHeading : newHeading.magneticHeading
        notifyListeners("heading", data: ["deg": deg])
    }

    public func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {}
    public func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {}
    public func locationManagerShouldDisplayHeadingCalibration(_ manager: CLLocationManager) -> Bool { true }
}
