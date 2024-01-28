import {NewSetItemEvent, newSetItemEventType} from "./crossTagMessage.ts";
import LocalStorageKey from "../enums/LocalStorageKey.ts";

export const loginListener = (doSomething: Function) => {
    const handler = (e: Event) => {
        const event = e as NewSetItemEvent
        
        if (event.key !== LocalStorageKey.TOKEN) return
        window.removeEventListener(newSetItemEventType, handler)
        localStorage.setItem(LocalStorageKey.TOKEN, event.newValue)
        const timer = setTimeout(() => {
            window.addEventListener(newSetItemEventType, handler)
            clearTimeout(timer)
        }, 0)
        doSomething()
    }
    window.addEventListener(newSetItemEventType, handler)
    
    return () => window.removeEventListener(newSetItemEventType, handler)
}
