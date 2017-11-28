
class Shader {

    constructor(gl, vertexName, fragmentName) {

        this.gl = gl;
        this.shader = null;

        this.init(vertexName,fragmentName);
    }

    getShader(id) {
        let script = document.getElementById(id);
        if (!script) {
            return null;
        }

        let str = "";
        let k = script.firstChild;
        while (k) {
            if (k.nodeType === 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }
        let shader;
        if (script.type === "x-shader/x-fragment") {
            shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        } else if (script.type === "x-shader/x-vertex") {
            shader = this.gl.createShader(this.gl.VERTEX_SHADER);
        } else {
            return null;
        }

        this.gl.shaderSource(shader, str);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert(this.gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    init(vertexName,fragmentName){

        let vertexShader = this.getShader(vertexName);
        let fragmentShader = this.getShader(fragmentName);

        this.shader = this.gl.createProgram();
        this.gl.attachShader(this.shader, vertexShader);
        this.gl.attachShader(this.shader, fragmentShader);
        this.gl.linkProgram(this.shader);
        this.gl.deleteShader(vertexShader);
        this.gl.deleteShader(fragmentShader);
    }

    use(){
        this.gl.useProgram(this.shader);
    }

    get(){
        return this.shader;
    }
}