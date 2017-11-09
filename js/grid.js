
class Grid{
    constructor(normalTexPath,gl){

        this.gl = gl;
        this.normalTexPath = normalTexPath;

        this.shader = null;

        this.normalTex = null;

        this.vertex = [];
        this.texture = [];
        this.index = [];

        this.vertexBuffer = null;
        this.texBuffer = null;
        this.indexBuffer = null;

        this.i = 0;
        this.time = 0;
        this.texSize = 0;

        this.model = mat4.create();
        this.normal = mat3.create();

        this.initProgram();
        this.initBuffers();
        this.initTexture();
        this.initMatrix();
    }

    initProgram(){
        this.shader = new Shader(this.gl,"shader-vs","shader-fs");

        this.shader.aPosition = this.gl.getAttribLocation(this.shader.get(), "aPosition");
        //this.shader.aNormal = this.gl.getAttribLocation(this.shader.get(), "aNormal");
        this.shader.aTexture = this.gl.getAttribLocation(this.shader.get(), "aTexture");

        this.shader.matrixModel = this.gl.getUniformLocation(this.shader.get(), "model");
        this.shader.matrixView = this.gl.getUniformLocation(this.shader.get(), "view");
        this.shader.matrixProj = this.gl.getUniformLocation(this.shader.get(), "projection");
        this.shader.matrixNormal = this.gl.getUniformLocation(this.shader.get(), "normal");

        this.shader.lightAmbiant = this.gl.getUniformLocation(this.shader.get(), "light.ambient");
        this.shader.lightDiffuse = this.gl.getUniformLocation(this.shader.get(), "light.diffuse");
        this.shader.lightSpecular = this.gl.getUniformLocation(this.shader.get(), "light.specular");
        this.shader.lightPosition = this.gl.getUniformLocation(this.shader.get(), "light.position");
        this.shader.viewPos = this.gl.getUniformLocation(this.shader.get(), "viewPos");
        this.shader.normalTexture = this.gl.getUniformLocation(this.shader.get(), "normalSampler");
        this.shader.skyboxloc = this.gl.getUniformLocation(this.shader.get() , "skybox");
        this.shader.detalX = this.gl.getUniformLocation(this.shader.get(), "detalX");
        this.shader.time = this.gl.getUniformLocation(this.shader.get(), "time");

    }

    generateGrid(gridSize){

        let i = 0;
        for(let x=0.0; x<gridSize; x+=1.0)
        {
            for (let z = 0.0; z <gridSize; z += 1.0)
            {
                this.vertex.push(x, 0.0, z);        //left upper
                this.vertex.push(x+1.0, 0.0, z);
                this.vertex.push(x+1.0, 0.0, z+1.0);
                this.vertex.push(x, 0.0, z+1.0);

                this.texture.push( 0.0, 0.0);
                this.texture.push( 1.0, 0.0);
                this.texture.push( 1.0, 1.0);
                this.texture.push( 0.0, 1.0);

                this.index.push(i);
                this.index.push(i+1);
                this.index.push(i+2);
                this.index.push(i);
                this.index.push(i+2);
                this.index.push(i+3);
                i +=4;
            }
        }
    }

    initBuffers() {

        this.generateGrid(500);

        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertex), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

        this.texBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.texture), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.index), this.gl.STATIC_DRAW);
    }

    initTexture(){
        this.normalTex = this.gl.createTexture();
        this.normalTex.image = new Image();
        this.normalTex.image.onload = function(){
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.normalTex);
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB, this.gl.RGB, this.gl.UNSIGNED_BYTE, this.normalTex.image);
            this.gl.generateMipmap(this.gl.TEXTURE_2D);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT); //Prevents s-coordinate wrapping (repeating).
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT); //Prevents t-coordinate wrapping (repeating).
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        }.bind(this);
        this.normalTex.image.src = this.normalTexPath;
    }

    initMatrix(){
        mat4.translate(this.model, this.model, [-1000.0, 0.0, -1000.0]);
        mat4.scale(this.model,this.model,[5.0,0.0,5.0]);
        mat3.normalFromMat4(this.normal, this.model);
    }

    animate() {
        this.i < this.normalTex.image.height ? this.i += 1.0 : this.i = 0.0;
        this.time++;
    }

    draw(view,projection,skybox,camera){
        this.shader.use();

        this.gl.enableVertexAttribArray(this.shader.aPosition);
        this.gl.enableVertexAttribArray(this.shader.aTexture);

        this.gl.uniform3fv(this.shader.lightAmbiant,[0.2, 0.2, 0.2]);
        this.gl.uniform3fv(this.shader.lightDiffuse,[0.5, 0.5, 0.5]);
        this.gl.uniform3fv(this.shader.lightSpecular,[1.0, 1.0, 1.0]);
        this.gl.uniform3fv(this.shader.lightPosition, [20.0, 20.0, 20.0]);
        this.gl.uniform3fv(this.shader.viewPos, camera.Position);

        this.gl.uniformMatrix4fv(this.shader.matrixModel, false, this.model);
        this.gl.uniformMatrix4fv(this.shader.matrixView, false, view);
        this.gl.uniformMatrix4fv(this.shader.matrixProj, false, projection);
        this.gl.uniformMatrix3fv(this.shader.matrixNormal, false, this.normal);

        this.gl.uniform1f(this.shader.detalX, this.i);
        this.gl.uniform1f(this.shader.time, this.time*0.001);

        this.gl.activeTexture(this.gl.TEXTURE1);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.normalTex);
        this.gl.uniform1i(this.shader.normalTexture,1);

        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, skybox.skybox);
        this.gl.uniform1i(this.shader.skyboxloc, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.vertexAttribPointer(this.shader.aPosition, 3, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texBuffer);
        this.gl.vertexAttribPointer(this.shader.aTexture, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        this.gl.drawElements(this.gl.TRIANGLES, this.index.length, this.gl.UNSIGNED_INT, 0);

        this.gl.disableVertexAttribArray(this.shader.aPosition);
        this.gl.disableVertexAttribArray(this.shader.aTexture);
    }
}
