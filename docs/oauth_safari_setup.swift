import UIKit
import SafariServices

final class ViewController: UIViewController, SFSafariViewControllerDelegate {

    private var safariVC: SFSafariViewController?

    func startGitHubOAuth() {
        let state = UUID().uuidString

        let oauthURLString = "https://github.com/login/oauth/authorize?client_id=3cbf764246cdf0cd86d8&redirect_uri=https%3A%2F%2Ffaucet.solana.com%2Fapi%2Fauth%2Fcallback%2Fgithub&response_type=code&scope=read%3Auser+user%3Aemail&state=\(state)"

        guard let url = URL(string: oauthURLString) else {
            print("Invalid OAuth URL")
            return
        }

        let safari = SFSafariViewController(url: url)
        safari.delegate = self
        safariVC = safari

        present(safari, animated: true)
    }

    func safariViewControllerDidFinish(_ controller: SFSafariViewController) {
        safariVC = nil
    }
}
