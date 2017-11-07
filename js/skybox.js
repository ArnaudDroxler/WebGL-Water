
class Skybox{
    constructor(path,gl){

        this.gl = gl;
        this.path = path;
        this.shader = null;

        this.textures = [];

        this.vertices = [];
        this.indices = [];

        this.vertexBuffer = null;
        this.indexBuffer = null;

        this.cntLoad = 0;
        this.skybox = null;
        this.loaded = false;

        this.targets = [
            this.gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
        ];
        this.faceName = ["right","left","top","bottom","back","front"];

        this.initProgram();
        this.initBuffers();
        this.initTexture();
    }

    initProgram(){

        this.shader = new Shader(this.gl,"skybox-shader-vs","skybox-shader-fs");

        this.shader.sbCoordsAttribute = this.gl.getAttribLocation(this.shader.get() , "aPos");
        this.shader.sbMVMatrixUniform = this.gl.getUniformLocation(this.shader.get() , "view");
        this.shader.sbPMatrixUniform = this.gl.getUniformLocation(this.shader.get() , "projection");
        this.shader.cubeTextureUniform = this.gl.getUniformLocation(this.shader.get() , "skybox");

    }

    createFace(xyz){
        let start = this.vertices.length/3;
        for (let i = 0; i < 12; i++) {
            this.vertices.push(xyz[i]);
        }
        this.indices.push(start,start+1,start+2,start,start+2,start+3);
    }

    initBuffers() {
        let s = 1.0;
        this.createFace( [-s,-s,s, s,-s,s, s,s,s, -s,s,s]);
        this.createFace( [-s,-s,-s, -s,s,-s, s,s,-s, s,-s,-s]);
        this.createFace( [-s,s,-s, -s,s,s, s,s,s, s,s,-s]);
        this.createFace( [-s,-s,-s, s,-s,-s, s,-s,s, -s,-s,s]);
        this.createFace( [s,-s,-s, s,s,-s, s,s,s, s,-s,s]);
        this.createFace( [-s,-s,-s, -s,-s,s, -s,s,s, -s,s,-s]);

        this.vertexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertices), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), this.gl.STATIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);

    }

    initTexture(){

        this.cntLoad = 0;
        for(let j = 0;j<6;j++)
        {
            this.textures[j] = new Image();
            this.textures[j].onload = this.textureLoading.bind(this);
            this.textures[j].src = this.path + this.faceName[j] + ".jpg";
        }
    }

    textureLoading(){
        this.cntLoad++;
        if(this.cntLoad === 6){
            this.skybox = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.skybox);
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
            for(let i = 0;i<6;i++)
            {
                this.gl.texImage2D(this.targets[i], 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.textures[i]);
                this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
            }
            this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);
            this.loaded = true;
        }
    }


    draw(view,projection){
        if(this.loaded){
            let view3 =  mat3.create();
            mat3.fromMat4(view3,view);
            let viewSkybox = mat4.fromValues(view3[0],view3[1],view3[2],0.0,view3[3],view3[4],view3[5],0.0,view3[6],view3[7],view3[8],0.0,0.0,0.0,0.0,0.0);

            this.shader.use();

            this.gl.depthFunc(this.gl.LEQUAL);

            this.gl.uniformMatrix4fv(this.shader.sbMVMatrixUniform, false, viewSkybox);
            this.gl.uniformMatrix4fv(this.shader.sbPMatrixUniform, false, projection);

            this.gl.enableVertexAttribArray(this.shader.sbCoordsAttribute);

            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.skybox);
            this.gl.uniform1i(this.shader.cubeTextureUniform, 0);

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
            this.gl.vertexAttribPointer(this.shader.sbCoordsAttribute, 3, this.gl.FLOAT, false, 0, 0);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_SHORT, 0);

            this.gl.disableVertexAttribArray(this.shader.sbCoordsAttribute);

            this.gl.depthFunc(this.gl.LESS);
        }
    }

}
