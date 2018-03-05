const w = window.innerWidth, h = window.innerHeight, size = Math.min(w, h) / 2
class TextExpanderAnimatorComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.text = this.getAttribute('text')
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, size, size)
        context.fillStyle = 'white'
        context.font = context.font.replace(/\d{2}/, size/12)
        const tw = context.measureText(this.text).width/2
        context.fillText(this.text, size/2 - tw, size/2)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
    }
}
customElements.define('teac-comp', TextExpanderAnimatorComponent)
