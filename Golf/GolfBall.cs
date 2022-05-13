using System;

public class GolfBall
{
    private class ShotPoint(){
        public Vector3 position;
        public Vector3 velocity;
        public Vector3 angularVelocity;
        public Vector3 acceleration;

        public ShotPoint(){
            position = new Vector(0,0,0);
            velocity = new Vector(0,0,0);
            angularVelocity = new Vector(0,0,0);
            acceleration = new Vector(0,0,0);
        }

        public ShotPoint clone(){
            ShotPoint point = new ShotPoint();
            point.position = new Vector3(position.x, position.y, position.z);
            point.velocity = new Vector3(velocity.x, velocity.y, velocity.z);
            point.acceleration = new Vector3(acceleration.x, acceleration.y, acceleration.z);
            point.angularVelocity = new Vector3(angularVelocity.x, angularVelocity.y, angularVelocity.z);
            return point;
        }
    }

    public List<Vector3> currShotPoints;

    private float mass = 0.0459f;
    private float crossSectionalArea = 0.04267 * Math.PI / 4;
    private float smashFactor = 1.49f;
    private float gravityMagnitude = -9.8f;
    private float dragCoefficient = 0.23f;
    private float liftCoefficient = .000014f;
    private float spinDecayRateConstant = 40;

    private float airDensity = 1.2041f; //.8f for rain
    private float initSpeedMPH = 0;
    private float initVerticalAngleDegrees = 0;
    private float initHorizontalAngleDegrees = 0;
    private float initBackspinRPM = 0;
    private float initSpinAngle = 0;  //hook/slice
    private float dt = .001f;

    private bool isHitting = false;
    private int currentShotPoint = 0;

	public GolfBall() {	}

    public Hit(float? airDensity, float? initSpeedMPH, float? initVerticalAngleDegrees,
                float? initHorizontalAngleDegrees, float? initBackspinRPM, float? initSpinAngle)
    {
        if (airDensity != null)
            this.airDensity = airDensity;
        if (initSpeedMPH != null)
            this.initSpeedMPH = initSpeedMPH;
        if (initVerticalAngleDegrees != null)
            this.initVerticalAngleDegrees = initVerticalAngleDegrees;
        if (initHorizontalAngleDegrees != null)
            this.initHorizontalAngleDegrees = initHorizontalAngleDegrees;
        if (initBackspinRPM != null)
            this.initBackspinRPM = initBackspinRPM;
        if (initSpinAngle != null)
            this.initSpinAngle = initSpinAngle;

        currShotPoints = new List<Vector3>();
        ShotPoint initPoint = new ShotPoint();
        initPoint.velocity = getInitialVelocity(initSpeedMPH, smashFactor, initVerticalAngleDegrees, initHorizontalAngleDegrees);
        initPoint.angularVelocity = getInitialSpin(initBackspinRPM, initSpinAngle);
        projectShot(initPoint);
        isHitting = true;
    }

    public void FixedUpdate(){
        if(isHitting){
            if(currentShotPoint > currShotPoints.length){
                isHitting = false;
                currentShotPoint = 0;
                return;
            }

            currentShotPoint++;

            gameObject.transform.position = currShotPoints[currentShotPoint];
        }
    }

    private Vector3 getInitialSpin(float spinRPM, float spinAngle)
    {
        Vector3 spin = new Vector3(0, 0, 0);
        spin.x = -1;
        spin.y = Math.Sin(spinAngle * Math.PI / 180);
        return spin.normalized * (spinRPM * 2 * Math.PI / 60);
    }

    private Vector3 getInitialVelocity(float speedMPH, float smashFactor, verticalDegrees, horizontalDegrees){
        Vector3 velocity = new Vector3(0,0,0);
        velocity.x = Math.Sin(-1 * horizontalDegrees * Math.PI / 180);
        velocity.y = Math.Sin(verticalDegrees * Math.PI / 180);
        velocity.z = Math.Cos(verticalDegrees * Math.PI / 180);
        float ballSpeed = Utility.toMPS(speedMPH * smashFactor);
        return velocity.normalized * ballSpeed;
    }

    private void projectShot(Vector3 initPoint){
        ShotPoint lastPoint = initPoint.clone();
        currShotPoints.Add(lastPoint.position);

        while(true){
            Vector3 newPoint = lastPoint.clone();

            Vector3 accel = getAcceleration(lastPoint);
            newPoint.velocity = newPoint.velocity + (accel * dt);
            newPoint.position = newPoint.position + (newPoint.velocity * dt);

            Vector3 decayRate = angularDecayVector(newPoint);
            newPoint.angularVelocity = newPoint.angularVelocity + decayRate;

            currShotPoints.Add(newPoint.position);

            if(newPoint.position.y <= 0){
                break;
            }

            lastPoint = newPoint;
        }
    }

    private Vector3 getAcceleration(currentPoint){
        Vector3 decay = currentPoint.angularVelocity;
        return decay.normalized * -1 * (spinDecayRateConstant * dt);
    }
}

public class Utility(){
    public static float toMPS(float mph) {
      return mph * 0.44704f;
    }

    public static float toMPH(float mps) {
      return mps * 2.23694f;
    }

    public static float toMeters(float yards) {
      return yards * 0.9144f;
    }

    public static float toYards(float meters) {
      return meters * 1.09361f;
    }

    public static float toRPM(float rps) {
      return rps * 9.54929659f;
    }
}
