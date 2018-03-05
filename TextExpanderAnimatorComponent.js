const w = window.innerWidth, h = window.innerHeight, size = Math.min(w, h) / 2
class TextExpanderAnimatorComponent extends HTMLElement {
    constructor() {
        super()
        this.img = document.createElement('img')
        const shadow = this.attachShadow({mode:'open'})
        shadow.appendChild(this.img)
        this.text = this.getAttribute('text')
        this.textExpander = new TextExpander(this.text)
        this.animator = new Animator()
    }
    render() {
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const context = canvas.getContext('2d')
        context.fillStyle = '#212121'
        context.fillRect(0, 0, size, size)
        this.textExpander.draw(context)
        this.img.src = canvas.toDataURL()
    }
    connectedCallback() {
        this.render()
        this.img.onmousedown = () => {
            this.textExpander.startUpdating(() => {
                this.animator.start(() => {
                    this.render()
                    this.textExpander.update(() => {
                        this.animator.stop()
                    })
                })
            })
        }
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
    startUpdating(startcb) {
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
class TextExpander {
    constructor(text) {
        this.text = text
        this.n = 5
        this.state = new State()
    }
    draw(context) {
        context.fillStyle = 'white'
        context.font = context.font.replace(/\d{2}/, size/12)
        const tw = context.measureText(this.text).width/2
        context.save()
        context.translate(size/2, size/2)
        context.rotate(2 * Math.PI * this.state.scales[0])
        const scale = this.state.scales[0]
        context.scale(scale, scale)
        context.globalAlpha = scale
        const y_gap = (size)/(2 * this.n)
        for(var i = 0; i < this.n; i++) {
            console.log((i - Math.floor(this.n/2) )* y_gap)
            context.fillText(this.text, - tw, ((i - Math.floor(this.n/2)) * y_gap) * this.state.scales[1])
        }
        context.restore()
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
customElements.define('teac-comp', TextExpanderAnimatorComponent)
