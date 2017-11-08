
const YAW        = -90.0;
const PITCH      =  0.0;
const SPEED      =  0.005;
const SENSITIVTY =  0.5;

class Camera {

    constructor(position, up, front) {

        this.Position = position;
        this.Front = front;
        this.Up = vec3.create();
        this.Right = vec3.create();
        this.WorldUp = up;

        this.Yaw = YAW;
        this.Pitch = PITCH;
        // Camera options
        this.MovementSpeed = SPEED;
        this.MouseSensitivity = SENSITIVTY;

        this.updateCameraVectors();

    }

    updateCameraVectors()
    {
        let front = vec3.create();
        front[0] = Math.cos(degToRad(this.Yaw)) * Math.cos(degToRad(this.Pitch));
        front[1]= Math.sin(degToRad(this.Pitch));
        front[2] = Math.sin(degToRad(this.Yaw)) * Math.cos(degToRad(this.Pitch));
        vec3.normalize(this.Front,front);

        let right = vec3.create();
        let up = vec3.create();
        vec3.cross(right,this.Front, this.WorldUp);
        vec3.normalize(this.Right,right);
        vec3.cross(up,this.Right, this.Front);
        vec3.normalize(this.Up ,up);
    }

    getViewMatrix()
    {
        let lookAt = mat4.create();
        let dir = vec3.create();
        vec3.add(dir,this.Position ,this.Front);
        mat4.lookAt(lookAt, this.Position, dir, this.Up);
        return lookAt;
    }


    processKeyboard(direction, deltaTime)
    {
        let velocity = this.MovementSpeed * deltaTime;
        if (direction === 0)
            vec3.scaleAndAdd(this.Position ,this.Position,this.Front,velocity );
        if (direction === 1)
            vec3.scaleAndAdd(this.Position ,this.Position,this.Front,-velocity);
        if (direction === 2)
            vec3.scaleAndAdd(this.Position ,this.Position,this.Right,-velocity);
        if (direction === 3)
            vec3.scaleAndAdd(this.Position ,this.Position,this.Right,velocity);

    }

    processMouseMovement(xoffset, yoffset)
    {
        xoffset *= this.MouseSensitivity;
        yoffset *= this.MouseSensitivity;

        this.Yaw   += xoffset;
        this.Pitch += yoffset;


        if (this.Pitch > 89.0)
        this.Pitch = 89.0;
        if (this.Pitch < -89.0)
        this.Pitch = -89.0;

        this.updateCameraVectors();
    }



}