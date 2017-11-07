
const YAW        = -90.0;
const PITCH      =  0.0;
const SPEED      =  2.5;
const SENSITIVTY =  0.1;
const ZOOM       =  45.0;

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
        this.Zoom = ZOOM;

        this.updateCameraVectors();

    }

    updateCameraVectors()
    {
        var front = vec3.create();
        front.x = Math.cos(degToRad(this.Yaw)) * Math.cos(degToRad(this.Pitch));
        front.y = Math.sin(degToRad(this.Pitch));
        front.z = Math.sin(degToRad(this.Yaw)) * Math.cos(degToRad(this.Pitch));
        vec3.normalize(this.Front,front);

        var right = vec3.create();
        var up = vec3.create();
        vec3.cross(right,this.Front, this.WorldUp);
        vec3.normalize(this.Right,right);
        vec3.cross(up,this.Right, this.Front);
        vec3.normalize(this.Up ,up);
    }

    getViewMatrix()
    {
        var lookAt = mat4.create();
        var dir = vec3.create();
        vec3.add(dir,this.Position ,this.Front);
        mat4.lookAt(lookAt, this.Position, dir, this.Up);
        return lookAt;
    }


    processKeyboard(direction, deltaTime)
    {
        var velocity = this.MovementSpeed * deltaTime;
        if (direction == 0)
            this.Position += this.Front * velocity;
        if (direction == 1)
            this.Position -= this.Front * velocity;
        if (direction == 2)
            this.Position -= this.Right * velocity;
        if (direction == 3)
            this.Position += this.Right * velocity;
    }

    processMouseScroll(yoffset)
    {
        if (this.Zoom >= 1.0 && this.Zoom <= 45.0)
        this.Zoom -= yoffset;
        if (this.Zoom <= 1.0)
        this.Zoom = 1.0;
        if (this.Zoom >= 45.0)
        this.Zoom = 45.0;
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