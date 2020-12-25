function init() {
    delete this.name
}

function installPod(pod) {
    pod.__ = this
    if (!this.pods) this.pods = []
    this.pods.push(pod)
    if (pod.onInstall) pod.onInstall()
}

function uninstallPod(pod) {
    if (!pod) return
    const i = this.pods.indexOf(pod)
    if (i < 0) return
    if (pod.onUninstall) pod.onUninstall()
    this.pods.splice(i, 1)
}
