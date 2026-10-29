import UIKit
import Capacitor

/// يسجّل جسر «Bilal» (إشعارات الأذان، القبلة، الإعدادات) المقابل لجسر أندرويد.
class BilalViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        bridge?.registerPluginInstance(BilalPlugin())
    }
}
