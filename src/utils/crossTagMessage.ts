import generateUUID from "./generateUUID.ts";

export function sendMessage(name: string, value: any) {
    localStorage.setItem('@@' + name, JSON.stringify({
        data: value,
        temp: generateUUID()
    }))
}

export function listenMessage(name: string, callback: Function, autoRemove = true) {
    const handler = (event: any) => {
        const eventKey = event.key
        if (!eventKey.startsWith('@@')) return;
        if (eventKey.substring(2) !== name) return;
        const newValue = JSON.parse(event.newValue)
        if (newValue === null || newValue === '') return;
        callback(newValue.data)
        if (autoRemove) localStorage.removeItem('@@' + name)
    }
    window.addEventListener('storage', handler)
    return () => {
        window.removeEventListener('storage', handler)
    }
}
