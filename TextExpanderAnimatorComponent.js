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
class State {
    constructor() {
        this.scales = [0, 0]
        this.j = 0
        this.prevScale = 0
        this.dir = 0
    }
    update(stopcb) {
        this.scales[this.j] += 0.1 * this.dir
        if(Math.abs(this.scales[this.j] - this.prevScale) > 1) {
            this.scales[this.j] = this.prevScale + this.dir
            this.j += this.dir
            if(this.j == this.scales.length || this.j == -1) {
                this.j -= this.dir
                this.dir = -1
                this.prevScale = this.scales[this.j]
                if(this.j == 0) {
                    this.dir = 0
                    stopcb()
                }
            }
        }
    }
    startUpdate(startcb) {
        if(this.dir == 0) {
            this.dir = 1
            startcb()
        }
    }
}
class Animator {
    constructor() {
        this.animated = false
    }
    start(updatecb) {
        if(!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 50)
        }
    }
    stop() {
        if(this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}
customElements.define('teac-comp', TextExpanderAnimatorComponent)
