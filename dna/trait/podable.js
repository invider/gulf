function installPod(pod) {
    pod.__ = this
    if (!this.pods) this.pods = []
    this.pods.push(pod)
    if (pod.name) this[pod.name] = pod
    if (pod.onInstall) pod.onInstall()
}

function uninstallPod(pod) {
    if (!pod) return
    const i = this.pods.indexOf(pod)
    if (i < 0) return
    if (pod.onUninstall) pod.onUninstall()
    if (pod.name) {
        delete this[pod.name]
    }
    this.pods.splice(i, 1)
}
