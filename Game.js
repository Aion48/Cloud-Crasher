window.onload = function() {

    //This is the angle you can see, increasing it lets you see more stuff, decreasing it lets you see less stuff.
var fov = 90.0;

//This is the nearest point that you can see
var fNear = 0.1;
//This is the furthest point that you can see
var fFar = 1000.0;
//This is the aspect ratio of the screen
var aspect = getHeight() / getWidth();
//This is the ratio that projects 3d to 2d points
var ratio = 1 / (Math.tan(fov * 0.5));

// These keep track of the rotation of the plane
var thetaZ = 0.00;
var thetaX = 0.00;
var thetaY = 0.00;
// This is the Color of the sky, name is self explanatory
var skyColor = new Color(135, 206, 235);
// This variable keeps track of the players score
var score = 0;
// This Matrix takes 3 dimension points and projects them onto a 2d screen.
var projection = [
    [aspect * ratio, 0, 0, 0],
    [0, ratio, 0, 0],
    [0, 0, fFar / (fFar - fNear), 1.0],
    [0, 0, (-fFar * fNear) / (fFar - fNear), 0.0]
];

//This is the sky
var rec = new WebImage("https://codehs.com/uploads/459155301f8779e78ae49a0009cf6e06");
rec.setSize(getWidth() + 100,getHeight() + 100);
rec.setPosition(-5,-5);




function start() {

    // Every 10 millisecond the entire screen is cleard, and the next position of every triangle is drawn on the screen.
    setTimer(step, 10);
    mouseMoveMethod(move);

}

function step() {
    //This function is just a way to call multiple functions with one timer. as of right now only one function is bieng called in order to keep the order of triangles the same.
    drawTriangles();

}

function move(e) {
    //This updates the global variables for rotation, so that the plane can rotate
    thetaX = -(e.getY() - (getHeight() / 2)) / 720;
    thetaY = -(e.getX() - (getWidth() / 2)) / 720;
    thetaZ = 3 * (-thetaY * -thetaX);
}

//It kind of gets messy here

// These variables are used to store the information of clouds so that they may be moved up
var allCloud = [];
var allRing = [];
var pRing = [];
// This stores how long it has been since the program started.
var time = 0;

//These store the last rings points so that the next ring isnt too far away.
var ringxpos = 0;
var ringypos = 0;
//This ensures rings arent drawn too soon to eachother

var timewait = 0;

//This keeps track of the players lives

var lives = 3;
function cloudPath() {



    // This updates the time by ten times the real time
    time += (0.1) * ((score + 20)/20);

    //This function randomly creates up to 50 clouds, increasing as the score increases
    if (Randomizer.nextInt(0, 1000) >= (975) && allCloud.length < (200 + score)) {
        //These randomize the x and y positions of the cloud, and spreads a few clouds around them.
        var xposc = Randomizer.nextInt(-40, 40);
        var yposc = Randomizer.nextInt(-40, 40);
        var v = Randomizer.nextInt(25, 200) / 100;
        var zf = 40;
        //Here 5 clouds are added to the array to make one big cloud
        allCloud.unshift([xposc + Randomizer.nextInt(-v, v), yposc + Randomizer.nextInt(-v, v), zf + Randomizer.nextInt(-v, v), Randomizer.nextInt(100, 200) / 50]);
        allCloud.unshift([xposc + Randomizer.nextInt(-v, v), yposc + Randomizer.nextInt(-v, v), zf + Randomizer.nextInt(-v, v), Randomizer.nextInt(100, 200) / 50]);
        allCloud.unshift([xposc + Randomizer.nextInt(-v, v), yposc + Randomizer.nextInt(-v, v), zf + Randomizer.nextInt(-v, v), Randomizer.nextInt(100, 200) / 50]);
        allCloud.unshift([xposc + Randomizer.nextInt(-v, v), yposc + Randomizer.nextInt(-v, v), zf + Randomizer.nextInt(-v, v), Randomizer.nextInt(100, 200) / 50]);
        allCloud.unshift([xposc + Randomizer.nextInt(-v, v), yposc + Randomizer.nextInt(-v, v), zf + Randomizer.nextInt(-v, v), Randomizer.nextInt(100, 200) / 50]);
    }

    //This does the same as the clouds, but with the rings and far fewer
    if (allRing.length < (3) && time >= timewait) {
        timewait = time + 20;
        ringxpos = Randomizer.nextInt(ringxpos - 10, ringxpos + 10);
        ringypos = Randomizer.nextInt(ringypos - 10, ringypos + 10);
        allRing.unshift([ringxpos, ringypos, 40]);
        pRing.unshift([ringxpos, ringypos, 40]);

    }
    //This array is used for storing the actual cloud object
    var allClouds = [];
    //This function creates a cloud object for all the cloud data in the allCloud array
    for (var h = 0; h < allCloud.length; h++) {

        allClouds.push(new Cloud3D(allCloud[h][0], allCloud[h][1], allCloud[h][2], 1));
    }
    //This function creates a ring object for all the ring data in the allRing array
    for (var h = 0; h < allRing.length; h++) {

        allClouds.push(new Ring(allRing[h][0], allRing[h][1], allRing[h][2], 2, 0.5, time));
    }
    //This function moves the clouds towards you, increasingly faster as your score gets larger
    for (var h = 0; h < allCloud.length; h++) {
        allCloud[h][2] += (-0.1 * ((score + 33) / 33));
    }

    //This function moves Clouds with the direction of the plane and movement of the mouse on the X axis. Once again the Variable is named incorrectly
    for (var h = 0; h < allCloud.length; h++) {
        allCloud[h][0] += (thetaY / 3) * ((score + 25) / 25);
    }
    //This function moves Clouds with the direction of the plane and movement of the mouse on the Y axis. Once again the Variable is named incorrectly
    for (var h = 0; h < allCloud.length; h++) {
        allCloud[h][1] += (thetaX / 3) * ((score + 25) / 25);
    }
    // This function removes clouds when they get close enough to the screen, and decreases you score when you collide with them
    for (var h = 0; h < allCloud.length; h++) {
        if (allCloud[h][2] <= -4) {

            if (allCloud[h][0] >= -2 && allCloud[h][0] <= 2) {
                if (allCloud[h][1] >= -2 && allCloud[h][1] <= 2) {
                    lives--;
                }
            }
            allCloud.splice(h, 1);
        }
    }

    //This function moves the rings towards you, increasingly faster as your score gets larger
    for (var h = 0; h < allRing.length; h++) {
        allRing[h][2] += (-0.1 * (score + 33) / 33);

    }
    
    for (var h = 0; h < pRing.length; h++) {
        pRing[h][2] += (-0.1 * (score + 33) / 33);

    }
    //This function moves Clouds with the direction of the plane and movement of the mouse on the X axis. Once again the Variable is named incorrectly
    for (var h = 0; h < allRing.length; h++) {
        allRing[h][0] += (thetaY / 3) * ((score + 33) / 33);

    }
    for (var h = 0; h < pRing.length; h++) {
        pRing[h][0] += (thetaY / 3) * ((score + 33) / 33);

    }
    ringxpos += (thetaY / 3) * ((score + 33) / 33);
    //This function moves Clouds with the direction of the plane and movement of the mouse on the Y axis. Once again the Variable is named incorrectly
    for (var h = 0; h < allRing.length; h++) {
        allRing[h][1] += (thetaX / 3) * ((score + 33) / 33);

    }
    for (var h = 0; h < pRing.length; h++) {
        pRing[h][1] += (thetaX / 3) * ((score + 33) / 33);

    }
    ringypos += (thetaX / 3) * ((score + 33) / 33);

    // This function removes rings when they get close enough to the screen, and increases you score when you go through them
    
    for (var h = 0; h < pRing.length; h++) {
        if (pRing[h][2] <= -5) {
            if (pRing[h][0] >= -1.5 && pRing[h][0] <= 1.5) {
                if (pRing[h][1] >= -1.5 && pRing[h][1] <= 1.5) {
                    score++;
                    if(score % 25 == 0){
                        lives++;
                    }
                }
            }
            pRing.splice(h, 1);
        }
    }
    for (var h = 0; h < allRing.length; h++) {
        if (allRing[h][2] <= -7) {
            
            allRing.splice(h, 1);
        }
    }
    
    allClouds.sort(function(a,b){return (b.zo - a.zo)})
    // These two for loops turns every object in the allClouds array and turns them into triangles
    for (var b = 0; b < allClouds.length; b++) {
        for (var g = 0; g < allClouds[b].group.mesh.length; g++) {
            //This would rotate the objects, except that the degree is 0 so they stay the same. It's here for testing
            var rotationf = [
                [1, 0, 0, 0],
                [0, Math.cos(0), Math.sin(0), 0],
                [0, -Math.sin(0), Math.cos(0), 0],
                [0, 0, 0, 1]
            ];
            //This creates a simple variable so i dont have to call this crazy stuff repeatedly
            var translatedtri = allClouds[b].group.mesh[g]
                // These apply the rotation matrix to the vectors
            var pv1rz = mMatrix(translatedtri.tri[0], rotationf);
            var pv2rz = mMatrix(translatedtri.tri[1], rotationf);
            var pv3rz = mMatrix(translatedtri.tri[2], rotationf);
            //These shift all the objects into view
            pv1rz.array[2] += 7;
            pv2rz.array[2] += 7;
            pv3rz.array[2] += 7;

            // I dont completely understand this section, but it takes two lines from a triangle and finds a lin enormal to it. This is used to find out wether or not the triangle is visible
            var line1 = new Vector(pv2rz.array[0] - pv1rz.array[0], pv2rz.array[1] - pv1rz.array[1], pv2rz.array[2] - pv1rz.array[2]);
            var line2 = new Vector(pv3rz.array[0] - pv1rz.array[0], pv3rz.array[1] - pv1rz.array[1], pv3rz.array[2] - pv1rz.array[2]);

            var normal = new Vector((line1.array[1] * line2.array[2]) - (line1.array[2] * line2.array[1]), (line1.array[2] * line2.array[0]) - (line1.array[0] * line2.array[2]), (line1.array[0] * line2.array[1]) - (line1.array[1] * line2.array[0]));

            var normal_Normal = Math.sqrt((normal.array[0] * normal.array[0]) + (normal.array[1] * normal.array[1]) + (normal.array[2] * normal.array[2]))
            normal.array[0] /= normal_Normal;
            normal.array[1] /= normal_Normal;
            normal.array[2] /= normal_Normal;
            //This if statement only projects and draws the triangle if they are facing the player, and therefore visible
            if ((normal.array[0] * pv1rz.array[0]) + (normal.array[1] * pv1rz.array[1]) + (normal.array[2] * pv1rz.array[2]) < 0) {
                //This multiplys the Vectors/Points by the projection matrix, returning a Vector with 2D points
                var pv1 = mMatrix(pv1rz, projection);
                var pv2 = mMatrix(pv2rz, projection);
                var pv3 = mMatrix(pv3rz, projection);
                //This scales up the Object and moves 0,0 to the center of the screen
                pv1.array[0] += 1;
                pv1.array[1] += 1;
                pv2.array[0] += 1;
                pv2.array[1] += 1;
                pv3.array[0] += 1;
                pv3.array[1] += 1;

                pv1.array[0] *= 0.5 * getWidth();
                pv2.array[0] *= 0.5 * getWidth();
                pv3.array[0] *= 0.5 * getWidth();
                pv1.array[1] *= 0.5 * getHeight();
                pv2.array[1] *= 0.5 * getHeight();
                pv3.array[1] *= 0.5 * getHeight();

                //This function creates a triangle from the points and color given
                triangle(pv1.array[0], pv1.array[1], pv2.array[0], pv2.array[1], pv3.array[0], pv3.array[1], allClouds[b].group.mesh[g].color)
            }

        }

    }
}
//This function creates the triangles for the plane, refreshes the screen, and calls the cloud creation function
function drawTriangles() {
    // theta += .01;

    //These Matrices use the global rotation variables to rotate the plane
    var rotationz = [
        [Math.cos(thetaZ), -Math.sin(thetaZ), 0, 0],
        [Math.sin(thetaZ), Math.cos(thetaZ), 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ];
    var rotationx = [
        [1, 0, 0, 0],
        [0, Math.cos(thetaX), Math.sin(thetaX), 0],
        [0, -Math.sin(thetaX), Math.cos(thetaX), 0],
        [0, 0, 0, 1]
    ];
    var rotationy = [
        [Math.cos(thetaY), 0, Math.sin(thetaY), 0],
        [0, 1, Math.sin(thetaY), 0],
        [-Math.sin(thetaY), 0, Math.cos(thetaY), 0],
        [0, 0, 0, 1]
    ];
    //This refreshes the screen
    removeAll();
    //This checks to see if the game is over, and then ends the game
    if (lives <= 0) {
        gameOver();
    }
    //this addds the background
    add(rec);
    rec.setPosition(-50 + (thetaY * 7),-50 + (thetaX * 7));
    //This variable stores all of the objects created
    var allObjects = [];

    //This function creates the clouds and rings
    cloudPath();
    //This creates the scoreboard in the top left of the screen
    var txt = new Text(score, "30pt Arial")
    txt.setColor(Color.CYAN);
    txt.setPosition(txt.getWidth(), txt.getHeight());
    add(txt);
    
    for(var i = 0; i < lives; i++){
        var heart = new WebImage("https://codehs.com/uploads/97e242df715d1fdaa319bd35b18804ea")
        heart.setSize(50,40);
        heart.setPosition(getWidth()-(heart.getWidth() * (i + 1)),0)
        add(heart);
    }
    //This adds the plane to the objects array, shifting it slightly with its rotations
    allObjects.push(new Plane(thetaY * 5, thetaX * 5, -3, 0.01));




    // These two for loops turns every object in the allObjectss array and turns them into triangles
    for (var b = 0; b < allObjects.length; b++) {
        for (var g = 0; g < allObjects[b].group.mesh.length; g++) {

            //This creates a simpler variable, so that I don thave to type allObjects[b].group.mesh[g]
            var translatedtri = allObjects[b].group.mesh[g]


            //These three Variables/Functions rotate the Vecotr by its respective axis
            var pv1rx = mMatrix(translatedtri.tri[0], rotationx);
            var pv2rx = mMatrix(translatedtri.tri[1], rotationx);
            var pv3rx = mMatrix(translatedtri.tri[2], rotationx);

            var pv1ry = mMatrix(pv1rx, rotationy);
            var pv2ry = mMatrix(pv2rx, rotationy);
            var pv3ry = mMatrix(pv3rx, rotationy);

            var pv1rz = mMatrix(pv1ry, rotationz);
            var pv2rz = mMatrix(pv2ry, rotationz);
            var pv3rz = mMatrix(pv3ry, rotationz);
            //This shifts the objeccts into view
            pv1rz.array[2] += 7;
            pv2rz.array[2] += 7;
            pv3rz.array[2] += 7;

            //These find the normal of the triangle, to find wether or not it will be visible
            var line1 = new Vector(pv2rz.array[0] - pv1rz.array[0], pv2rz.array[1] - pv1rz.array[1], pv2rz.array[2] - pv1rz.array[2]);
            var line2 = new Vector(pv3rz.array[0] - pv1rz.array[0], pv3rz.array[1] - pv1rz.array[1], pv3rz.array[2] - pv1rz.array[2]);

            var normal = new Vector((line1.array[1] * line2.array[2]) - (line1.array[2] * line2.array[1]), (line1.array[2] * line2.array[0]) - (line1.array[0] * line2.array[2]), (line1.array[0] * line2.array[1]) - (line1.array[1] * line2.array[0]));

            var normal_Normal = Math.sqrt((normal.array[0] * normal.array[0]) + (normal.array[1] * normal.array[1]) + (normal.array[2] * normal.array[2]))
            normal.array[0] /= normal_Normal;
            normal.array[1] /= normal_Normal;
            normal.array[2] /= normal_Normal;
            //This only project and draw the triangles if they are visible
            if ((normal.array[0] * pv1rz.array[0]) + (normal.array[1] * pv1rz.array[1]) + (normal.array[2] * pv1rz.array[2]) < 0) {
                //This projects the variables
                var pv1 = mMatrix(pv1rz, projection);
                var pv2 = mMatrix(pv2rz, projection);
                var pv3 = mMatrix(pv3rz, projection);
                //These make the object centered and scaled up
                pv1.array[0] += 1;
                pv1.array[1] += 1;
                pv2.array[0] += 1;
                pv2.array[1] += 1;
                pv3.array[0] += 1;
                pv3.array[1] += 1;

                pv1.array[0] *= 0.5 * getWidth();
                pv2.array[0] *= 0.5 * getWidth();
                pv3.array[0] *= 0.5 * getWidth();
                pv1.array[1] *= 0.5 * getHeight();
                pv2.array[1] *= 0.5 * getHeight();
                pv3.array[1] *= 0.5 * getHeight();

                //This function draws a triangle for the points given
                triangle(pv1.array[0], pv1.array[1], pv2.array[0], pv2.array[1], pv3.array[0], pv3.array[1], allObjects[b].group.mesh[g].color)
            }

        }

    }




}
// This function stops the game
function gameOver() {
    stopTimer(step);
    var txt = new Text("GAME OVER", "30pt Arial");
    txt.setPosition(getWidth() / 2, getHeight() / 2);
    add(txt);
}
// This construcer allows for a 3d point to be created and stored
function Vector(x, y, z) {
    this.array = [x, y, z, 1]
        /* this.add = function(dx,dy,dz) {
               this.xp += dx;
               this.yp += dy;
               this.zp += dz;
         };*/
}
//This constructer allows for a triangle to be made out of three 3D points
function Triangle(p1, p2, p3, color) {
    this.color =  Color.black ;
    this.tri = [p1, p2, p3];
    this.color = color;
}
//This does the same but in reverse order
function Triangler(p1, p2, p3, color) {
    this.color =  Color.black ;
    this.tri = [p1, p3, p2];
    this.color = color;
}

//This constructor allows for triangles to be grouped together and stored.
function Mesh() {
    this.mesh = [];
    this.add = function(b) {
        this.mesh.push(b);
    };
}
// This Constructor contains all the coordinates for the plane
function Plane(originpointx, originpointy, originpointz, scale) {
    
    var p1 = new Vector((originpointx + 65.5151) * scale,(originpointy - -51.9992) * scale,(originpointz - -47.5893) * scale);
    var p2 = new Vector((originpointx + 65.8859) * scale,(originpointy - -74.4398) * scale,(originpointz - -53.9772) * scale);
    var p3 = new Vector((originpointx + 429.797) * scale,(originpointy - -63.3079) * scale,(originpointz - -35.8101) * scale);
    var p4 = new Vector((originpointx + 429.797) * scale,(originpointy - -63.3079) * scale,(originpointz - -35.8101) * scale);
    var p5 = new Vector((originpointx + 434.423) * scale,(originpointy - -62.0183) * scale,(originpointz - -111.068) * scale);
    var p6 = new Vector((originpointx + 65.5151) * scale,(originpointy - -51.9992) * scale,(originpointz - -47.5893) * scale);
    var p7 = new Vector((originpointx + 434.423) * scale,(originpointy - -62.0183) * scale,(originpointz - -111.068) * scale);
    var p8 = new Vector((originpointx + 65.5151) * scale,(originpointy - -51.9992) * scale,(originpointz - -47.5893) * scale);
    var p9 = new Vector((originpointx + 76.5238) * scale,(originpointy - -55.6372) * scale,(originpointz - -234.613) * scale);
    var p10 = new Vector((originpointx + 65.8859) * scale,(originpointy - -74.4398) * scale,(originpointz - -53.9772) * scale);
    var p11 = new Vector((originpointx + 429.797) * scale,(originpointy - -63.3079) * scale,(originpointz - -35.8101) * scale);
    var p12 = new Vector((originpointx + 434.423) * scale,(originpointy - -62.0183) * scale,(originpointz - -111.068) * scale);
    var p13 = new Vector((originpointx + 434.423) * scale,(originpointy - -62.0183) * scale,(originpointz - -111.068) * scale);
    var p14 = new Vector((originpointx + 65.8859) * scale,(originpointy - -74.4398) * scale,(originpointz - -53.9772) * scale);
    var p15 = new Vector((originpointx + 76.5238) * scale,(originpointy - -55.6372) * scale,(originpointz - -234.613) * scale);
    var p16 = new Vector((originpointx + 0) * scale,(originpointy + 46) * scale,(originpointz + 400) * scale);
    var p17 = new Vector((originpointx + 0) * scale,(originpointy - 0.63172) * scale,(originpointz - -334.451) * scale);
    var p18 = new Vector((originpointx + 53.0601) * scale,(originpointy - -9.03094) * scale,(originpointz - -334.451) * scale);
    var p19 = new Vector((originpointx + 76.5238) * scale,(originpointy - -47.0827) * scale,(originpointz - -334.652) * scale);
    var p20 = new Vector((originpointx + 67.3129) * scale,(originpointy - -80.689) * scale,(originpointz - -334.846) * scale);
    var p21 = new Vector((originpointx + 0) * scale,(originpointy - -93.2309) * scale,(originpointz - -334.846) * scale);
    var p22 = new Vector((originpointx + 67.3129) * scale,(originpointy - -80.689) * scale,(originpointz - -334.846) * scale);
    var p23 = new Vector((originpointx + 0) * scale,(originpointy - -93.2309) * scale,(originpointz - -334.846) * scale);
    var p24 = new Vector((originpointx + 58.8643) * scale,(originpointy - -88.112) * scale,(originpointz - -0.938596) * scale);
    var p25 = new Vector((originpointx + 0) * scale,(originpointy - -104.423) * scale,(originpointz - 11.4381) * scale);
    var p26 = new Vector((originpointx + 7.44354) * scale,(originpointy - -49.749) * scale,(originpointz - 368.795) * scale);
    var p27 = new Vector((originpointx + 0) * scale,(originpointy - -49.749) * scale,(originpointz - 368.795) * scale);
    var p28 = new Vector((originpointx + 53.0601) * scale,(originpointy - -9.03094) * scale,(originpointz - -334.451) * scale);
    var p29 = new Vector((originpointx + 0) * scale,(originpointy - 0.63172) * scale,(originpointz - -334.451) * scale);
    var p30 = new Vector((originpointx + 76.5238) * scale,(originpointy - 0) * scale,(originpointz - -234.415) * scale);
    var p31 = new Vector((originpointx + 0) * scale,(originpointy - 0) * scale,(originpointz - -234.415) * scale);
    var p32 = new Vector((originpointx + 56.3204) * scale,(originpointy - 95.3228) * scale,(originpointz - -186.659) * scale);
    var p33 = new Vector((originpointx + 0) * scale,(originpointy - 95.3228) * scale,(originpointz - -186.659) * scale);
    var p34 = new Vector((originpointx + 41.2616) * scale,(originpointy - 64.9181) * scale,(originpointz - 0.58298) * scale);
    var p35 = new Vector((originpointx + 0) * scale,(originpointy - 64.9181) * scale,(originpointz - 0.58298) * scale);
    var p36 = new Vector((originpointx + 29.5693) * scale,(originpointy - 23.3465) * scale,(originpointz - 134.769) * scale);
    var p37 = new Vector((originpointx + 0) * scale,(originpointy - 30.0098) * scale,(originpointz - 132.369) * scale);
    var p38 = new Vector((originpointx + 16.8868) * scale,(originpointy - -40.6836) * scale,(originpointz - 320.494) * scale);
    var p39 = new Vector((originpointx + 2.63234) * scale,(originpointy - -16.2234) * scale,(originpointz - 307.934) * scale);
    var p40 = new Vector((originpointx + 7.44354) * scale,(originpointy - -43.4973) * scale,(originpointz - 368.985) * scale);
    var p41 = new Vector((originpointx + 6.18677) * scale,(originpointy - -23.075) * scale,(originpointz - 369.181) * scale);
    var p42 = new Vector((originpointx + 7.44354) * scale,(originpointy - -43.4973) * scale,(originpointz - 368.985) * scale);
    var p43 = new Vector((originpointx + 7.44354) * scale,(originpointy - -49.749) * scale,(originpointz - 368.795) * scale);
    var p44 = new Vector((originpointx + 132.381) * scale,(originpointy - -45.4412) * scale,(originpointz - 379.054) * scale);
    var p45 = new Vector((originpointx + 7.44354) * scale,(originpointy - -49.749) * scale,(originpointz - 368.795) * scale);
    var p46 = new Vector((originpointx + 132.381) * scale,(originpointy - -45.4412) * scale,(originpointz - 379.054) * scale);
    var p47 = new Vector((originpointx + 134.187) * scale,(originpointy - -44.5429) * scale,(originpointz - 349.079) * scale);
    var p48 = new Vector((originpointx + 7.44354) * scale,(originpointy - -49.749) * scale,(originpointz - 368.795) * scale);
    var p49 = new Vector((originpointx + 134.187) * scale,(originpointy - -44.5429) * scale,(originpointz - 349.079) * scale);
    var p50 = new Vector((originpointx + 16.8868) * scale,(originpointy - -40.6836) * scale,(originpointz - 320.494) * scale);
    var p51 = new Vector((originpointx + 132.381) * scale,(originpointy - -45.4412) * scale,(originpointz - 379.054) * scale);
    var p52 = new Vector((originpointx + 7.44354) * scale,(originpointy - -49.749) * scale,(originpointz - 368.795) * scale);
    var p53 = new Vector((originpointx + 16.8868) * scale,(originpointy - -40.6836) * scale,(originpointz - 320.494) * scale);
    var p54 = new Vector((originpointx + 16.8868) * scale,(originpointy - -40.6836) * scale,(originpointz - 320.494) * scale);
    var p55 = new Vector((originpointx + 132.381) * scale,(originpointy - -45.4412) * scale,(originpointz - 379.054) * scale);
    var p56 = new Vector((originpointx + 134.187) * scale,(originpointy - -44.5429) * scale,(originpointz - 349.079) * scale);
    var p57 = new Vector((originpointx + 7.44354) * scale,(originpointy - -43.4973) * scale,(originpointz - 368.985) * scale);
    var p58 = new Vector((originpointx + -7.44354) * scale,(originpointy - -43.4973) * scale,(originpointz - 368.985) * scale);
    var p59 = new Vector((originpointx + 0) * scale,(originpointy - 107.014) * scale,(originpointz - 381.358) * scale);
    var p60 = new Vector((originpointx + 7.44354) * scale,(originpointy - -43.4973) * scale,(originpointz - 368.985) * scale);
    var p61 = new Vector((originpointx + 0) * scale,(originpointy - 107.014) * scale,(originpointz - 381.358) * scale);
    var p62 = new Vector((originpointx + 2.63234) * scale,(originpointy - -16.2234) * scale,(originpointz - 307.934) * scale);
    var p63 = new Vector((originpointx + 0) * scale,(originpointy - 107.014) * scale,(originpointz - 381.358) * scale);
    var p64 = new Vector((originpointx + 2.63234) * scale,(originpointy - -16.2234) * scale,(originpointz - 307.934) * scale);
    var p65 = new Vector((originpointx + 0) * scale,(originpointy - 95.7186) * scale,(originpointz - 332.947) * scale);
    var p66 = new Vector((originpointx + 53.0601) * scale,(originpointy - -9.03094) * scale,(originpointz - -334.451) * scale);
    var p67 = new Vector((originpointx + 76.5238) * scale,(originpointy - 0) * scale,(originpointz - -234.415) * scale);
    var p68 = new Vector((originpointx + 76.5238) * scale,(originpointy - -47.0827) * scale,(originpointz - -334.652) * scale);
    var p69 = new Vector((originpointx + 66.9912) * scale,(originpointy - -93.8626) * scale,(originpointz - -234.81) * scale);
    var p70 = new Vector((originpointx + 67.3129) * scale,(originpointy - -80.689) * scale,(originpointz - -334.846) * scale);
    var p71 = new Vector((originpointx + 66.9912) * scale,(originpointy - -93.8626) * scale,(originpointz - -234.81) * scale);
    var p72 = new Vector((originpointx + 76.5238) * scale,(originpointy - 0) * scale,(originpointz - -234.415) * scale);
    var p73 = new Vector((originpointx + 58.8643) * scale,(originpointy - -88.112) * scale,(originpointz - -0.938596) * scale);
    var p74 = new Vector((originpointx + 62.8263) * scale,(originpointy - -19.1838) * scale,(originpointz - -1.81019) * scale);
    var p75 = new Vector((originpointx + 39.8816) * scale,(originpointy - -81.8337) * scale,(originpointz - 135.618) * scale);
    var p76 = new Vector((originpointx + 44.6776) * scale,(originpointy - -30.5192) * scale,(originpointz - 136.093) * scale);
    var p77 = new Vector((originpointx + 7.44354) * scale,(originpointy - -49.749) * scale,(originpointz - 368.795) * scale);
    var p78 = new Vector((originpointx + 76.5238) * scale,(originpointy - 0) * scale,(originpointz - -234.415) * scale);
    var p79 = new Vector((originpointx + 56.3204) * scale,(originpointy - 95.3228) * scale,(originpointz - -186.659) * scale);
    var p80 = new Vector((originpointx + 62.8263) * scale,(originpointy - -19.1838) * scale,(originpointz - -1.81019) * scale);
    var p81 = new Vector((originpointx + 41.2616) * scale,(originpointy - 64.9181) * scale,(originpointz - 0.58298) * scale);
    var p82 = new Vector((originpointx + 44.6776) * scale,(originpointy - -30.5192) * scale,(originpointz - 136.093) * scale);
    var p83 = new Vector((originpointx + 29.5693) * scale,(originpointy - 23.3465) * scale,(originpointz - 134.769) * scale);
    var p84 = new Vector((originpointx + 16.8868) * scale,(originpointy - -40.6836) * scale,(originpointz - 320.494) * scale); 
            
            
    var pr1 = new Vector((originpointx + -65.5151) * scale,(originpointy - -51.9992) * scale,(originpointz - -47.5893) * scale);
    var pr2 = new Vector((originpointx + -65.8859) * scale,(originpointy - -74.4398) * scale,(originpointz - -53.9772) * scale);
    var pr3 = new Vector((originpointx + -429.797) * scale,(originpointy - -63.3079) * scale,(originpointz - -35.8101) * scale);
    var pr4 = new Vector((originpointx + -429.797) * scale,(originpointy - -63.3079) * scale,(originpointz - -35.8101) * scale);
    var pr5 = new Vector((originpointx + -434.423) * scale,(originpointy - -62.0183) * scale,(originpointz - -111.068) * scale);
    var pr6 = new Vector((originpointx + -65.5151) * scale,(originpointy - -51.9992) * scale,(originpointz - -47.5893) * scale);
    var pr7 = new Vector((originpointx + -434.423) * scale,(originpointy - -62.0183) * scale,(originpointz - -111.068) * scale);
    var pr8 = new Vector((originpointx + -65.5151) * scale,(originpointy - -51.9992) * scale,(originpointz - -47.5893) * scale);
    var pr9 = new Vector((originpointx + -76.5238) * scale,(originpointy - -55.6372) * scale,(originpointz - -234.613) * scale);
    var pr10 = new Vector((originpointx + -65.8859) * scale,(originpointy - -74.4398) * scale,(originpointz - -53.9772) * scale);
    var pr11 = new Vector((originpointx + -429.797) * scale,(originpointy - -63.3079) * scale,(originpointz - -35.8101) * scale);
    var pr12 = new Vector((originpointx + -434.423) * scale,(originpointy - -62.0183) * scale,(originpointz - -111.068) * scale);
    var pr13 = new Vector((originpointx + -434.423) * scale,(originpointy - -62.0183) * scale,(originpointz - -111.068) * scale);
    var pr14 = new Vector((originpointx + -65.8859) * scale,(originpointy - -74.4398) * scale,(originpointz - -53.9772) * scale);
    var pr15 = new Vector((originpointx + -76.5238) * scale,(originpointy - -55.6372) * scale,(originpointz - -234.613) * scale);
    var pr16 = new Vector((originpointx + 0) * scale,(originpointy + 46) * scale,(originpointz + 400) * scale);
    var pr17 = new Vector((originpointx + 0) * scale,(originpointy - 0.63172) * scale,(originpointz - -334.451) * scale);
    var pr18 = new Vector((originpointx + -53.0601) * scale,(originpointy - -9.03094) * scale,(originpointz - -334.451) * scale);
    var pr19 = new Vector((originpointx + -76.5238) * scale,(originpointy - -47.0827) * scale,(originpointz - -334.652) * scale);
    var pr20 = new Vector((originpointx + -67.3129) * scale,(originpointy - -80.689) * scale,(originpointz - -334.846) * scale);
    var pr21 = new Vector((originpointx + 0) * scale,(originpointy - -93.2309) * scale,(originpointz - -334.846) * scale);
    var pr22 = new Vector((originpointx + -67.3129) * scale,(originpointy - -80.689) * scale,(originpointz - -334.846) * scale);
    var pr23 = new Vector((originpointx + 0) * scale,(originpointy - -93.2309) * scale,(originpointz - -334.846) * scale);
    var pr24 = new Vector((originpointx + -58.8643) * scale,(originpointy - -88.112) * scale,(originpointz - -0.938596) * scale);
    var pr25 = new Vector((originpointx + 0) * scale,(originpointy - -104.423) * scale,(originpointz - 11.4381) * scale);
    var pr26 = new Vector((originpointx + -7.44354) * scale,(originpointy - -49.749) * scale,(originpointz - 368.795) * scale);
    var pr27 = new Vector((originpointx + 0) * scale,(originpointy - -49.749) * scale,(originpointz - 368.795) * scale);
    var pr28 = new Vector((originpointx + -53.0601) * scale,(originpointy - -9.03094) * scale,(originpointz - -334.451) * scale);
    var pr29 = new Vector((originpointx + 0) * scale,(originpointy - 0.63172) * scale,(originpointz - -334.451) * scale);
    var pr30 = new Vector((originpointx + -76.5238) * scale,(originpointy - 0) * scale,(originpointz - -234.415) * scale);
    var pr31 = new Vector((originpointx + 0) * scale,(originpointy - 0) * scale,(originpointz - -234.415) * scale);
    var pr32 = new Vector((originpointx + -56.3204) * scale,(originpointy - 95.3228) * scale,(originpointz - -186.659) * scale);
    var pr33 = new Vector((originpointx + 0) * scale,(originpointy - 95.3228) * scale,(originpointz - -186.659) * scale);
    var pr34 = new Vector((originpointx + -41.2616) * scale,(originpointy - 64.9181) * scale,(originpointz - 0.58298) * scale);
    var pr35 = new Vector((originpointx + 0) * scale,(originpointy - 64.9181) * scale,(originpointz - 0.58298) * scale);
    var pr36 = new Vector((originpointx + -29.5693) * scale,(originpointy - 23.3465) * scale,(originpointz - 134.769) * scale);
    var pr37 = new Vector((originpointx + 0) * scale,(originpointy - 30.0098) * scale,(originpointz - 132.369) * scale);
    var pr38 = new Vector((originpointx + -16.8868) * scale,(originpointy - -40.6836) * scale,(originpointz - 320.494) * scale);
    var pr39 = new Vector((originpointx + -2.63234) * scale,(originpointy - -16.2234) * scale,(originpointz - 307.934) * scale);
    var pr40 = new Vector((originpointx + -7.44354) * scale,(originpointy - -43.4973) * scale,(originpointz - 368.985) * scale);
    var pr41 = new Vector((originpointx + -6.18677) * scale,(originpointy - -23.075) * scale,(originpointz - 369.181) * scale);
    var pr42 = new Vector((originpointx + -7.44354) * scale,(originpointy - -43.4973) * scale,(originpointz - 368.985) * scale);
    var pr43 = new Vector((originpointx + -7.44354) * scale,(originpointy - -49.749) * scale,(originpointz - 368.795) * scale);
    var pr44 = new Vector((originpointx + -132.381) * scale,(originpointy - -45.4412) * scale,(originpointz - 379.054) * scale);
    var pr45 = new Vector((originpointx + -7.44354) * scale,(originpointy - -49.749) * scale,(originpointz - 368.795) * scale);
    var pr46 = new Vector((originpointx + -132.381) * scale,(originpointy - -45.4412) * scale,(originpointz - 379.054) * scale);
    var pr47 = new Vector((originpointx + -134.187) * scale,(originpointy - -44.5429) * scale,(originpointz - 349.079) * scale);
    var pr48 = new Vector((originpointx + -7.44354) * scale,(originpointy - -49.749) * scale,(originpointz - 368.795) * scale);
    var pr49 = new Vector((originpointx + -134.187) * scale,(originpointy - -44.5429) * scale,(originpointz - 349.079) * scale);
    var pr50 = new Vector((originpointx + -16.8868) * scale,(originpointy - -40.6836) * scale,(originpointz - 320.494) * scale);
    var pr51 = new Vector((originpointx + -132.381) * scale,(originpointy - -45.4412) * scale,(originpointz - 379.054) * scale);
    var pr52 = new Vector((originpointx + -7.44354) * scale,(originpointy - -49.749) * scale,(originpointz - 368.795) * scale);
    var pr53 = new Vector((originpointx + -16.8868) * scale,(originpointy - -40.6836) * scale,(originpointz - 320.494) * scale);
    var pr54 = new Vector((originpointx + -16.8868) * scale,(originpointy - -40.6836) * scale,(originpointz - 320.494) * scale);
    var pr55 = new Vector((originpointx + -132.381) * scale,(originpointy - -45.4412) * scale,(originpointz - 379.054) * scale);
    var pr56 = new Vector((originpointx + -134.187) * scale,(originpointy - -44.5429) * scale,(originpointz - 349.079) * scale);
    var pr57 = new Vector((originpointx + -7.44354) * scale,(originpointy - -43.4973) * scale,(originpointz - 368.985) * scale);
    var pr58 = new Vector((originpointx + 7.44354) * scale,(originpointy - -43.4973) * scale,(originpointz - 368.985) * scale);
    var pr59 = new Vector((originpointx + 0) * scale,(originpointy - 107.014) * scale,(originpointz - 381.358) * scale);
    var pr60 = new Vector((originpointx + -7.44354) * scale,(originpointy - -43.4973) * scale,(originpointz - 368.985) * scale);
    var pr61 = new Vector((originpointx + 0) * scale,(originpointy - 107.014) * scale,(originpointz - 381.358) * scale);
    var pr62 = new Vector((originpointx + -2.63234) * scale,(originpointy - -16.2234) * scale,(originpointz - 307.934) * scale);
    var pr63 = new Vector((originpointx + 0) * scale,(originpointy - 107.014) * scale,(originpointz - 381.358) * scale);
    var pr64 = new Vector((originpointx + -2.63234) * scale,(originpointy - -16.2234) * scale,(originpointz - 307.934) * scale);
    var pr65 = new Vector((originpointx + 0) * scale,(originpointy - 95.7186) * scale,(originpointz - 332.947) * scale);
    var pr66 = new Vector((originpointx + -53.0601) * scale,(originpointy - -9.03094) * scale,(originpointz - -334.451) * scale);
    var pr67 = new Vector((originpointx + -76.5238) * scale,(originpointy - 0) * scale,(originpointz - -234.415) * scale);
    var pr68 = new Vector((originpointx + -76.5238) * scale,(originpointy - -47.0827) * scale,(originpointz - -334.652) * scale);
    var pr69 = new Vector((originpointx + -66.9912) * scale,(originpointy - -93.8626) * scale,(originpointz - -234.81) * scale);
    var pr70 = new Vector((originpointx + -67.3129) * scale,(originpointy - -80.689) * scale,(originpointz - -334.846) * scale);
    var pr71 = new Vector((originpointx + -66.9912) * scale,(originpointy - -93.8626) * scale,(originpointz - -234.81) * scale);
    var pr72 = new Vector((originpointx + -76.5238) * scale,(originpointy - 0) * scale,(originpointz - -234.415) * scale);
    var pr73 = new Vector((originpointx + -58.8643) * scale,(originpointy - -88.112) * scale,(originpointz - -0.938596) * scale);
    var pr74 = new Vector((originpointx + -62.8263) * scale,(originpointy - -19.1838) * scale,(originpointz - -1.81019) * scale);
    var pr75 = new Vector((originpointx + -39.8816) * scale,(originpointy - -81.8337) * scale,(originpointz - 135.618) * scale);
    var pr76 = new Vector((originpointx + -44.6776) * scale,(originpointy - -30.5192) * scale,(originpointz - 136.093) * scale);
    var pr77 = new Vector((originpointx + -7.44354) * scale,(originpointy - -49.749) * scale,(originpointz - 368.795) * scale);
    var pr78 = new Vector((originpointx + -76.5238) * scale,(originpointy - 0) * scale,(originpointz - -234.415) * scale);
    var pr79 = new Vector((originpointx + -56.3204) * scale,(originpointy - 95.3228) * scale,(originpointz - -186.659) * scale);
    var pr80 = new Vector((originpointx + -62.8263) * scale,(originpointy - -19.1838) * scale,(originpointz - -1.81019) * scale);
    var pr81 = new Vector((originpointx + -41.2616) * scale,(originpointy - 64.9181) * scale,(originpointz - 0.58298) * scale);
    var pr82 = new Vector((originpointx + -44.6776) * scale,(originpointy - -30.5192) * scale,(originpointz - 136.093) * scale);
    var pr83 = new Vector((originpointx + -29.5693) * scale,(originpointy - 23.3465) * scale,(originpointz - 134.769) * scale);
    var pr84 = new Vector((originpointx + -16.8868) * scale,(originpointy - -40.6836) * scale,(originpointz - 320.494) * scale);
        
        var green = new Color(85,107,47);
        var t1 = new Triangle(p1,p2,p3,green);
        var t2 = new Triangle(p4,p5,p6,green);
        var t3 = new Triangle(p7,p8,p9,green);
        var t4 = new Triangle(p10,p11,p12,green);
        var t5 = new Triangle(p13,p14,p15,green);
        var t6 = new Triangle(p16,p17,p18,green);
        var t7 = new Triangle(p16,p18,p19,green);
        var t8 = new Triangle(p16,p19,p20,green);
        var t9 = new Triangle(p16,p20,p21,green);
        var t10 = new Triangle(p22,p23,p24,green);
        var t11 = new Triangle(p23,p24,p25,green);
        var t12 = new Triangle(p24,p25,p26,green);
        var t13 = new Triangle(p25,p26,p27,green);
        var t14 = new Triangle(p28,p29,p30,green);
        var t15 = new Triangle(p29,p30,p31,green);
        var t16 = new Triangle(p30,p31,p32,green);
        var t17 = new Triangle(p31,p32,p33,green);
        var t18 = new Triangle(p32,p33,p34,green);
        var t19 = new Triangle(p33,p34,p35,green);
        var t20 = new Triangle(p34,p35,p36,green);
        var t21 = new Triangle(p35,p36,p37,green);
        var t22 = new Triangle(p36,p37,p38,green);
        var t23 = new Triangle(p37,p38,p39,green);
        var t24 = new Triangle(p38,p39,p40,green);
        var t25 = new Triangle(p39,p40,p41,green);
        var t26 = new Triangle(p42,p43,p44,green);
        var t27 = new Triangle(p45,p46,p47,green);
        var t28 = new Triangle(p48,p49,p48,green);
        var t29 = new Triangle(p51,p52,p53,green);
        var t30 = new Triangle(p54,p55,p56,green);
        var t31 = new Triangle(p57,p58,p59,green);
        var t32 = new Triangle(p60,p61,p62,green);
        var t33 = new Triangle(p63,p64,p65,green);
        var t34 = new Triangle(p66,p67,p68,green);
        var t35 = new Triangle(p67,p68,p69,green);
        var t36 = new Triangle(p68,p69,p70,green);
        var t37 = new Triangle(p71,p72,p73,green);
        var t38 = new Triangle(p72,p73,p74,green);
        var t39 = new Triangle(p73,p74,p75,green);
        var t40 = new Triangle(p74,p75,p76,green);
        var t41 = new Triangle(p75,p76,p77,green);
        var t42 = new Triangle(p78,p79,p80,green);
        var t43 = new Triangle(p79,p80,p81,green);
        var t44 = new Triangle(p80,p81,p82,green);
        var t45 = new Triangle(p81,p82,p83,green);
        var t46 = new Triangle(p82,p83,p84,green);
        
        var tr1 = new Triangler(pr1,pr2,pr3,green);
        var tr2 = new Triangler(pr4,pr5,pr6,green);
        var tr3 = new Triangler(pr7,pr8,pr9,green);
        var tr4 = new Triangler(pr10,pr11,pr12,green);
        var tr5 = new Triangler(pr13,pr14,pr15,green);
        var tr6 = new Triangler(pr16,pr17,pr18,green);
        var tr7 = new Triangler(pr16,pr18,pr19,green);
        var tr8 = new Triangler(pr16,pr19,pr20,green);
        var tr9 = new Triangler(pr16,pr20,pr21,green);
        var tr10 = new Triangler(pr22,pr23,pr24,green);
        var tr11 = new Triangler(pr23,pr24,pr25,green);
        var tr12 = new Triangler(pr24,pr25,pr26,green);
        var tr13 = new Triangler(pr25,pr26,pr27,green);
        var tr14 = new Triangler(pr28,pr29,pr30,green);
        var tr15 = new Triangler(pr29,pr30,pr31,green);
        var tr16 = new Triangler(pr30,pr31,pr32,green);
        var tr17 = new Triangler(pr31,pr32,pr33,green);
        var tr18 = new Triangler(pr32,pr33,pr34,green);
        var tr19 = new Triangler(pr33,pr34,pr35,green);
        var tr20 = new Triangler(pr34,pr35,pr36,green);
        var tr21 = new Triangler(pr35,pr36,pr37,green);
        var tr22 = new Triangler(pr36,pr37,pr38,green);
        var tr23 = new Triangler(pr37,pr38,pr39,green);
        var tr24 = new Triangler(pr38,pr39,pr40,green);
        var tr25 = new Triangler(pr39,pr40,pr41,green);
        var tr26 = new Triangler(pr42,pr43,pr44,green);
        var tr27 = new Triangler(pr45,pr46,pr47,green);
        var tr28 = new Triangler(pr48,pr49,pr48,green);
        var tr29 = new Triangler(pr51,pr52,pr53,green);
        var tr30 = new Triangler(pr54,pr55,pr56,green);
        var tr31 = new Triangler(pr57,pr58,pr59,green);
        var tr32 = new Triangler(pr60,pr61,pr62,green);
        var tr33 = new Triangler(pr63,pr64,pr65,green);
        var tr34 = new Triangler(pr66,pr67,pr68,green);
        var tr35 = new Triangler(pr67,pr68,pr69,green);
        var tr36 = new Triangler(pr68,pr69,pr70,green);
        var tr37 = new Triangler(pr71,pr72,pr73,green);
        var tr38 = new Triangler(pr72,pr73,pr74,green);
        var tr39 = new Triangler(pr73,pr74,pr75,green);
        var tr40 = new Triangler(pr74,pr75,pr76,green);
        var tr41 = new Triangler(pr75,pr76,pr77,green);
        var tr42 = new Triangler(pr78,pr79,pr80,green);
        var tr43 = new Triangler(pr79,pr80,pr81,green);
        var tr44 = new Triangler(pr80,pr81,pr82,green);
        var tr45 = new Triangler(pr81,pr82,pr83,green);
        var tr46 = new Triangler(pr82,pr83,pr84,green);
        
        this.group = new Mesh();
        this.group.add(t1);
        this.group.add(t2);
        this.group.add(t3);
        this.group.add(t4);
        this.group.add(t5);
        this.group.add(t6);
        this.group.add(t7);
        this.group.add(t8);
        this.group.add(t9);
        this.group.add(t10);
        this.group.add(t11);
        this.group.add(t12);
        this.group.add(t13);
        this.group.add(t14);
        this.group.add(t15);
        this.group.add(t16);
        this.group.add(t17);
        this.group.add(t18);
        this.group.add(t19);
        this.group.add(t20);
        this.group.add(t21);
        this.group.add(t22);
        this.group.add(t23);
        this.group.add(t24);
        this.group.add(t25);
        this.group.add(t26);
        this.group.add(t27);
        this.group.add(t28);
        this.group.add(t29);
        this.group.add(t30);
        this.group.add(t31);
        this.group.add(t32);
        this.group.add(t33);
        this.group.add(t34);
        this.group.add(t35);
        this.group.add(t36);
        this.group.add(t37);
        this.group.add(t38);
        this.group.add(t39);
        this.group.add(t40);
        this.group.add(t41);
        this.group.add(t42);
        this.group.add(t43);
        this.group.add(t44);
        this.group.add(t45);
        this.group.add(t46);
        this.group.add(tr1);
        this.group.add(tr2);
        this.group.add(tr3);
        this.group.add(tr4);
        this.group.add(tr5);
        this.group.add(tr6);
        this.group.add(tr7);
        this.group.add(tr8);
        this.group.add(tr9);
        this.group.add(tr10);
        this.group.add(tr11);
        this.group.add(tr12);
        this.group.add(tr13);
        this.group.add(tr14);
        this.group.add(tr15);
        this.group.add(tr16);
        this.group.add(tr17);
        this.group.add(tr18);
        this.group.add(tr19);
        this.group.add(tr20);
        this.group.add(tr21);
        this.group.add(tr22);
        this.group.add(tr23);
        this.group.add(tr24);
        this.group.add(tr25);
        this.group.add(tr26);
        this.group.add(tr27);
        this.group.add(tr28);
        this.group.add(tr29);
        this.group.add(tr30);
        this.group.add(tr31);
        this.group.add(tr32);
        this.group.add(tr33);
        this.group.add(tr34);
        this.group.add(tr35);
        this.group.add(tr36);
        this.group.add(tr37);
        this.group.add(tr38);
        this.group.add(tr39);
        this.group.add(tr40);
        this.group.add(tr41);
        this.group.add(tr42);
        this.group.add(tr43);
        this.group.add(tr44);
        this.group.add(tr45);
        this.group.add(tr46);//*/

    
    
    
    
    
    
 /*   //Front Ring
    var p1 = new Vector((originpointx - 1) * scale, (originpointy - 3) * scale, (originpointz - -1) * scale);
    var p2 = new Vector((originpointx + 1) * scale, (originpointy - 3) * scale, (originpointz - -1) * scale);
    var p3 = new Vector((originpointx + 3) * scale, (originpointy - 1) * scale, (originpointz - -1) * scale);
    var p4 = new Vector((originpointx + 3) * scale, (originpointy + 1) * scale, (originpointz - -1) * scale);
    var p5 = new Vector((originpointx + 1) * scale, (originpointy + 3) * scale, (originpointz - -1) * scale);
    var p6 = new Vector((originpointx - 1) * scale, (originpointy + 3) * scale, (originpointz - -1) * scale);
    var p7 = new Vector((originpointx - 3) * scale, (originpointy + 1) * scale, (originpointz - -1) * scale);
    var p8 = new Vector((originpointx - 3) * scale, (originpointy - 1) * scale, (originpointz - -1) * scale);
    //Back Ring
    var p9 = new Vector((originpointx - 1) * scale, (originpointy - 3) * scale, (originpointz + -2) * scale);
    var p10 = new Vector((originpointx + 1) * scale, (originpointy - 3) * scale, (originpointz + -2) * scale);
    var p11 = new Vector((originpointx + 3) * scale, (originpointy - 1) * scale, (originpointz + -2) * scale);
    var p12 = new Vector((originpointx + 3) * scale, (originpointy + 1) * scale, (originpointz + -2) * scale);
    var p13 = new Vector((originpointx + 1) * scale, (originpointy + 3) * scale, (originpointz + -2) * scale);
    var p14 = new Vector((originpointx - 1) * scale, (originpointy + 3) * scale, (originpointz + -2) * scale);
    var p15 = new Vector((originpointx - 3) * scale, (originpointy + 1) * scale, (originpointz + -2) * scale);
    var p16 = new Vector((originpointx - 3) * scale, (originpointy - 1) * scale, (originpointz + -2) * scale);
    var ringColor = new Color(255, 255, 255);
    var t1 = new Triangle(p1, p8, p9, ringColor);
    var t2 = new Triangle(p1, p9, p10, ringColor);
    var t3 = new Triangle(p2, p1, p10, ringColor);
    var t4 = new Triangle(p2, p10, p11, ringColor);
    var t5 = new Triangle(p3, p2, p11, ringColor);
    var t8 = new Triangle(p4, p12, p13, ringColor);
    var t9 = new Triangle(p5, p4, p13, ringColor);
    var t10 = new Triangle(p5, p13, p14, ringColor);
    var t11 = new Triangle(p6, p5, p14, ringColor);
    var t12 = new Triangle(p6, p14, p15, ringColor);
    var t13 = new Triangle(p7, p6, p15, ringColor);
    var t16 = new Triangle(p8, p16, p9, ringColor);
    // Front Point , Propellor connection
    var p17 = new Vector((originpointx + 0) * scale, (originpointy + 0) * scale, (originpointz - -6) * scale);
    var propellorColor = new Color(255, 0, 0);
    var t17 = new Triangle(p1, p2, p17, propellorColor);
    var t18 = new Triangle(p2, p3, p17, propellorColor);
    var t19 = new Triangle(p3, p4, p17, propellorColor);
    var t20 = new Triangle(p4, p5, p17, propellorColor);
    var t21 = new Triangle(p5, p6, p17, propellorColor);
    var t22 = new Triangle(p6, p7, p17, propellorColor);
    var t23 = new Triangle(p7, p8, p17, propellorColor);
    var t24 = new Triangle(p8, p1, p17, propellorColor);
    // Left Wings Endpoints
    var p18 = new Vector((originpointx - 8) * scale, (originpointy + 0) * scale, (originpointz + 0) * scale);
    var p19 = new Vector((originpointx - 8) * scale, (originpointy + 0) * scale, (originpointz + -1) * scale);
    var wingColor = new Color(255, 142, 0);
    var t39 = new Triangle(p18, p8, p7, wingColor);
    var t40 = new Triangle(p19, p15, p16, wingColor);
    var t41 = new Triangle(p18, p16, p8, wingColor);
    var t42 = new Triangle(p18, p19, p16, wingColor)
    var t43 = new Triangle(p18, p7, p15, wingColor);
    var t44 = new Triangle(p18, p15, p19, wingColor);
    // Right Wing Endpoints
    var p20 = new Vector((originpointx + 8) * scale, (originpointy + 0) * scale, (originpointz + 0) * scale);
    var p21 = new Vector((originpointx + 8) * scale, (originpointy + 0) * scale, (originpointz + -1) * scale);
    var t45 = new Triangle(p20, p4, p3, wingColor);
    var t46 = new Triangle(p21, p11, p12, wingColor);
    var t47 = new Triangle(p20, p3, p11, wingColor);
    var t48 = new Triangle(p20, p11, p21, wingColor)
    var t49 = new Triangle(p20, p12, p4, wingColor);
    var t50 = new Triangle(p20, p21, p12, wingColor);
    // Tail wing 
    var p22 = new Vector((originpointx + 0) * scale, (originpointy + 1) * scale, (originpointz + -8) * scale);
    var p23 = new Vector((originpointx + 0) * scale, (originpointy + 1) * scale, (originpointz + -11) * scale);
    var p24 = new Vector((originpointx + 0) * scale, (originpointy + 3) * scale, (originpointz + -11) * scale);
    // Back
    var p25 = new Vector((originpointx - 1) * scale, (originpointy - 1) * scale, (originpointz + -11) * scale);
    var p26 = new Vector((originpointx + 1) * scale, (originpointy - 1) * scale, (originpointz + -11) * scale);
    var p27 = new Vector((originpointx + 1) * scale, (originpointy + 1) * scale, (originpointz + -11) * scale);
    var p28 = new Vector((originpointx - 1) * scale, (originpointy + 1) * scale, (originpointz + -11) * scale);
    var tailColor = new Color(110, 213, 31)
    var t25 = new Triangle(p9, p25, p10, tailColor);
    var t26 = new Triangle(p10, p25, p26, tailColor);
    var t27 = new Triangle(p10, p26, p11, tailColor);
    var t28 = new Triangle(p11, p26, p12, tailColor);
    var t29 = new Triangle(p12, p26, p27, tailColor);
    var t30 = new Triangle(p12, p27, p13, tailColor);
    var t31 = new Triangle(p13, p27, p14, tailColor);
    var t32 = new Triangle(p14, p27, p28, tailColor);
    var t33 = new Triangle(p14, p28, p15, tailColor);
    var t34 = new Triangle(p16, p15, p28, tailColor);
    var t35 = new Triangle(p16, p28, p25, tailColor);
    var t36 = new Triangle(p16, p25, p9, tailColor);
    var t37 = new Triangle(p25, p27, p26, tailColor);
    var t38 = new Triangle(p25, p28, p27, tailColor);
    //Left Back wing
    var p29 = new Vector((originpointx - 1) * scale, (originpointy + 0) * scale, (originpointz + -8) * scale);
    var p30 = new Vector((originpointx - 3) * scale, (originpointy + 0) * scale, (originpointz + -11) * scale);
    //Right Back Wing
    var p31 = new Vector((originpointx + 1) * scale, (originpointy + 0) * scale, (originpointz + -8) * scale);
    var p32 = new Vector((originpointx + 3) * scale, (originpointy + 0) * scale, (originpointz + -11) * scale);
    this.group = new Mesh();
    this.group.add(t1);
    this.group.add(t2);
    this.group.add(t3);
    this.group.add(t4);
    this.group.add(t5);
    this.group.add(t8);
    this.group.add(t9);
    this.group.add(t10);
    this.group.add(t11);
    this.group.add(t12);
    this.group.add(t13);
    this.group.add(t16); //*/
  /*  this.group.add(t17);
    this.group.add(t18);
    this.group.add(t19);
    this.group.add(t20);
    this.group.add(t21);
    this.group.add(t22);
    this.group.add(t23);
    this.group.add(t24); //*/
   /* this.group.add(t39);
    this.group.add(t40);
    this.group.add(t41);
    this.group.add(t42);
    this.group.add(t43);
    this.group.add(t44);
    this.group.add(t45);
    this.group.add(t46);
    this.group.add(t47);
    this.group.add(t48);
    this.group.add(t49);
    this.group.add(t50);
    this.group.add(t25);
    this.group.add(t26);
    this.group.add(t27);
    this.group.add(t28);
    this.group.add(t29);
    this.group.add(t30);
    this.group.add(t31);
    this.group.add(t32);
    this.group.add(t33);
    this.group.add(t34);
    this.group.add(t35);
    this.group.add(t36);
    this.group.add(t37);
    this.group.add(t38); //*/



}
//This constrcter contains all the coordinates for the Cloud
function Cloud3D(originpointx, originpointy, originpointz, scale, color) {
    var white = new Color(255, 255, 255);
    this.xo = originpointx;
    this.yo = originpointy;
    this.zo = originpointz;
    var p1 = new Vector(scale * (this.xo + 0.416496), scale * (this.yo + 0.10678), scale * (this.zo + 1.28111));
    var p2 = new Vector(scale * (this.xo + 0.004904), scale * (this.yo + 0.713535), scale * (this.zo + 1.15142));
    var p3 = new Vector(scale * (this.xo + -0.758248), scale * (this.yo + 0.037628), scale * (this.zo + 1.04396));
    var p4 = new Vector(scale * (this.xo + -1.09339), scale * (this.yo + 0.713531), scale * (this.zo + 0.36025));
    var p5 = new Vector(scale * (this.xo + -0.540326), scale * (this.yo + 1.27339), scale * (this.zo + 0));
    var p6 = new Vector(scale * (this.xo + -0.680336), scale * (this.yo + 0.713532), scale * (this.zo + -0.92877));
    var p7 = new Vector(scale * (this.xo + 0.303791), scale * (this.yo + 0.941862), scale * (this.zo + -0.934266));
    var p8 = new Vector(scale * (this.xo + -0.416026), scale * (this.yo + -0.031525), scale * (this.zo + -1.28111));
    var p9 = new Vector(scale * (this.xo + 0.758719), scale * (this.yo + 0.037628), scale * (this.zo + -1.04396));
    var p10 = new Vector(scale * (this.xo + -0.004433), scale * (this.yo + -0.638279), scale * (this.zo + -1.15142));
    var p11 = new Vector(scale * (this.xo + 1.09386), scale * (this.yo + -0.638275), scale * (this.zo + -0.36025));
    var p12 = new Vector(scale * (this.xo + 0.540798), scale * (this.yo + -1.19813), scale * (this.zo + 0));
    var p13 = new Vector(scale * (this.xo + 0.680806), scale * (this.yo + -0.638278), scale * (this.zo + 0.928769));
    var p14 = new Vector(scale * (this.xo + -0.303321), scale * (this.yo + -0.866607), scale * (this.zo + 0.934266));
    var p19 = new Vector(scale * (this.xo + 0.909951), scale * (this.yo + 0.981434), scale * (this.zo + 0.317734));
    var p20 = new Vector(scale * (this.xo + 0.114398), scale * (this.yo + 1.32065), scale * (this.zo + 0.351365));
    var p25 = new Vector(scale * (this.xo + 1.34728), scale * (this.yo + 0.10678), scale * (this.zo + 0));
    var p27 = new Vector(scale * (this.xo + 0.758719), scale * (this.yo + 0.037628), scale * (this.zo + -1.04396));
    var p30 = new Vector(scale * (this.xo + 1.09675), scale * (this.yo + 0.713532), scale * (this.zo + -0.351365));
    var p41 = new Vector(scale * (this.xo + -0.90948), scale * (this.yo + -0.90618), scale * (this.zo + 0.317734));
    var p42 = new Vector(scale * (this.xo + -1.34681), scale * (this.yo + -0.031525), scale * (this.zo + 0));
    var p43 = new Vector(scale * (this.xo + -1.09627), scale * (this.yo + -0.638277), scale * (this.zo + -0.351365));
    var p54 = new Vector(scale * (this.xo + -0.113928), scale * (this.yo + -1.24539), scale * (this.zo + -0.351365));
   
    var cloudWhite = new Color(193 - (originpointz * 1.5), 190 - (originpointz * 1.5), 186 - (originpointz * 1.5));

    var t1 = new Triangle(p1,p2,p3,cloudWhite);//
        var t2 = new Triangle(p2,p4,p3,cloudWhite);//
        var t3 = new Triangle(p3,p5,p4,cloudWhite);//
        var t4 = new Triangle(p4,p5,p6,cloudWhite);//
        var t5 = new Triangle(p5,p7,p6,cloudWhite);//
        var t6 = new Triangle(p6,p7,p8,cloudWhite);
        var t7 = new Triangle(p7,p9,p8,cloudWhite);
        var t8 = new Triangle(p8,p9,p10,cloudWhite);
        var t9 = new Triangle(p9,p11,p10,cloudWhite);
        var t10 = new Triangle(p10,p11,p12,cloudWhite);
        var t11 = new Triangle(p11,p13,p12,cloudWhite);
        var t12 = new Triangle(p12,p13,p14,cloudWhite);
        var t13 = new Triangle(p13,p1,p14,cloudWhite);
        var t14 = new Triangle(p14,p1,p2,cloudWhite);
        var t15 = new Triangle(p1,p19,p2,cloudWhite);
        var t16 = new Triangle(p2,p19,p20,cloudWhite);
        var t17 = new Triangle(p19,p7,p20,cloudWhite);
        var t18 = new Triangle(p20,p7,p5,cloudWhite);
        var t19 = new Triangle(p1,p13,p25,cloudWhite);
        var t20 = new Triangle(p13,p11,p25,cloudWhite);
        var t21 = new Triangle(p25,p11,p27,cloudWhite);
        var t22 = new Triangle(p27,p7,p30,cloudWhite);
        var t23 = new Triangle(p7,p19,p30,cloudWhite);
        var t24 = new Triangle(p30,p19,p25,cloudWhite);
        var t25 = new Triangle(p19,p1,p25,cloudWhite);
        var t26 = new Triangle(p27,p30,p25,cloudWhite);
        var t27 = new Triangle(p2,p20,p5,cloudWhite);
        var t28 = new Triangle(p3,p42,p41,cloudWhite);
        var t29 = new Triangle(p41,p42,p43,cloudWhite);
        var t30 = new Triangle(p43,p42,p8,cloudWhite);
        var t31 = new Triangle(p43,p8,p10,cloudWhite);
        var t32 = new Triangle(p6,p8,p42,cloudWhite);
        var t33 = new Triangle(p6,p42,p4,cloudWhite);
        var t34 = new Triangle(p42,p3,p4,cloudWhite);
        var t35 = new Triangle(p14,p3,p41,cloudWhite);
        var t36 = new Triangle(p14,p41,p54,cloudWhite);
        var t37 = new Triangle(p43,p54,p41,cloudWhite);
        var t38 = new Triangle(p54,p43,p10,cloudWhite);
        var t39 = new Triangle(p14,p54,p12,cloudWhite);
        var t40 = new Triangle(p54,p10,p12,cloudWhite);

    this.group = new Mesh();
    this.group.add(t1);
    this.group.add(t2);
    this.group.add(t3);
    this.group.add(t4);
    this.group.add(t5);
    this.group.add(t6);
    this.group.add(t7);
    this.group.add(t8);
    this.group.add(t9);
    this.group.add(t10);
    this.group.add(t11);
    this.group.add(t12);
    this.group.add(t13);
    this.group.add(t14);
    this.group.add(t15);
    this.group.add(t16);
    this.group.add(t17);
    this.group.add(t18);
    this.group.add(t19);
    this.group.add(t20);
    this.group.add(t21);
    this.group.add(t22);
    this.group.add(t23);
    this.group.add(t24);
    this.group.add(t25);
    this.group.add(t26);
    this.group.add(t27);
    this.group.add(t28);
    this.group.add(t29);
    this.group.add(t30);
    this.group.add(t31);
    this.group.add(t32);
    this.group.add(t33);
    this.group.add(t34);
    this.group.add(t35);
    this.group.add(t36);
    this.group.add(t37);
    this.group.add(t38);
    this.group.add(t39);
    this.group.add(t40); //*/

    this.movez = function(move) {
        this.zo += move;
    }
}
//This constructer contains all the points for a ring
function Ring(originpointx, originpointy, originpointz, radius, width, timex) {
    this.xo = originpointx;
    this.yo = originpointy;
    this.zo = originpointz;
    var p1 = new Vector(originpointx + ((1 / 2) * radius), originpointy - ((Math.sqrt(3) / 2) * radius), originpointz);
    var p2 = new Vector(originpointx + radius, originpointy, originpointz);
    var p3 = new Vector(originpointx + ((1 / 2) * radius), originpointy + ((Math.sqrt(3) / 2) * radius), originpointz);
    var p4 = new Vector(originpointx - ((1 / 2) * radius), originpointy + ((Math.sqrt(3) / 2) * radius), originpointz);
    var p5 = new Vector(originpointx - radius, originpointy, originpointz);
    var p6 = new Vector(originpointx - ((1 / 2) * radius), originpointy - ((Math.sqrt(3) / 2) * radius), originpointz);
    var radiusw = radius + width;
    var po1 = new Vector(originpointx + ((1 / 2) * radiusw), originpointy - ((Math.sqrt(3) / 2) * radiusw), originpointz);
    var po2 = new Vector(originpointx + radiusw, originpointy, originpointz);
    var po3 = new Vector(originpointx + ((1 / 2) * radiusw), originpointy + ((Math.sqrt(3) / 2) * radiusw), originpointz);
    var po4 = new Vector(originpointx - ((1 / 2) * radiusw), originpointy + ((Math.sqrt(3) / 2) * radiusw), originpointz);
    var po5 = new Vector(originpointx - radiusw, originpointy, originpointz);
    var po6 = new Vector(originpointx - ((1 / 2) * radiusw), originpointy - ((Math.sqrt(3) / 2) * radiusw), originpointz);
    //*/
    //this function allows the ring to "rotate"
    if ((timex % 6) >= 1 && (timex % 6) < 2) {
        var color1 = Color.RED;
        var color2 = Color.PURPLE;
        var color3 = Color.BLUE;
        var color4 = Color.GREEN;
        var color5 = Color.YELLOW;
        var color6 = Color.ORANGE;
    } else if ((timex % 6) >= 2 && (timex % 6) < 3) {
        var color2 = Color.RED;
        var color3 = Color.PURPLE;
        var color4 = Color.BLUE;
        var color5 = Color.GREEN;
        var color6 = Color.YELLOW;
        var color1 = Color.ORANGE;
    } else if ((timex % 6) >= 3 && (timex % 6) < 4) {
        var color3 = Color.RED;
        var color4 = Color.PURPLE;
        var color5 = Color.BLUE;
        var color6 = Color.GREEN;
        var color1 = Color.YELLOW;
        var color2 = Color.ORANGE;
    } else if ((timex % 6) >= 4 && (timex % 6) < 5) {
        var color4 = Color.RED;
        var color5 = Color.PURPLE;
        var color6 = Color.BLUE;
        var color1 = Color.GREEN;
        var color2 = Color.YELLOW;
        var color3 = Color.ORANGE;
    } else if ((timex % 6) >= 5 && (timex % 6) < 6) {
        var color5 = Color.RED;
        var color6 = Color.PURPLE;
        var color1 = Color.BLUE;
        var color2 = Color.GREEN;
        var color3 = Color.YELLOW;
        var color4 = Color.ORANGE;
    } else {
        var color6 = Color.RED;
        var color1 = Color.PURPLE;
        var color2 = Color.BLUE;
        var color3 = Color.GREEN;
        var color4 = Color.YELLOW;
        var color5 = Color.ORANGE;
    }




    var t1 = new Triangle(po1, p1, p2, color1);
    var t2 = new Triangle(po1, p2, po2, color2);
    var t3 = new Triangle(po2, p2, p3, color2);
    var t4 = new Triangle(po2, p3, po3, color3);
    var t5 = new Triangle(po3, p3, p4, color3);
    var t6 = new Triangle(po3, p4, po4, color4);
    var t7 = new Triangle(po4, p4, p5, color4);
    var t8 = new Triangle(po4, p5, po5, color5);
    var t9 = new Triangle(po5, p5, p6, color5);
    var t10 = new Triangle(po5, p6, po6, color6);
    var t11 = new Triangle(po6, p6, p1, color6);
    var t12 = new Triangle(po6, p1, po1, color1);

    this.group = new Mesh();
    this.group.add(t1);
    this.group.add(t2);
    this.group.add(t3);
    this.group.add(t4);
    this.group.add(t5);
    this.group.add(t6);
    this.group.add(t7);
    this.group.add(t8);
    this.group.add(t9);
    this.group.add(t10);
    this.group.add(t11);
    this.group.add(t12);

}
//This function creates either a colored triangle or a black wire triangle
function triangle(x1, y1, x2, y2, x3, y3, color) {
    var j = getWidth() / 2;
    var k = getHeight() / 2;
    if (color == Color.black) {

        let l1 = new Line((x1), (y1), (x2), (y2));
        let l2 = new Line((x3), (y3), (x2), (y2));
        let l3 = new Line((x1), (y1), (x3), (y3));

        l1.setColor(color);
        l2.setColor(color);
        l3.setColor(color);
        add(l1);
        add(l2);
        add(l3); //  */
    } else {
        var tri = new Polygon();
        tri.addPoint(x1, y1);
        tri.addPoint(x2, y2);
        tri.addPoint(x3, y3);
        tri.setColor(color);
        add(tri);
    }


}
//This function multiplys a vector by a matrix
function mMatrix(vector, matrix4x4) {
    var projectedVector = new Vector(0, 0, 0);
    projectedVector.array[0] = (vector.array[0] * matrix4x4[0][0]) + (vector.array[1] * matrix4x4[1][0]) + (vector.array[2] * matrix4x4[2][0]) + (matrix4x4[3][0]);
    projectedVector.array[1] = (vector.array[0] * matrix4x4[0][1]) + (vector.array[1] * matrix4x4[1][1]) + (vector.array[2] * matrix4x4[2][1]) + (matrix4x4[3][1]);
    projectedVector.array[2] = (vector.array[0] * matrix4x4[0][2]) + (vector.array[1] * matrix4x4[1][2]) + (vector.array[2] * matrix4x4[2][2]) + (matrix4x4[3][2]);
    let w = (vector.array[0] * matrix4x4[0][3]) + (vector.array[1] * matrix4x4[1][3]) + (vector.array[2] * matrix4x4[2][3]) + matrix4x4[3][3];

    if (w != 0) {
        projectedVector.array[0] /= w;
        projectedVector.array[1] /= w;
        projectedVector.array[2] /= w;
    }

    return projectedVector;

}

//This function multyplys a matrix by another matrix, as long as they are both 4x4
function mMatrix4x4(matrix2, matrix1) {
    if (matrix1[0].length == matrix2.length) {
        let matrix3 = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        for (var h = 0; h < matrix3.length; h++) {
            for (var b = 0; b < matrix3.length; b++) {
                var add = 0;
                for (var g = 0; g < matrix1[0].length; g++) {
                    add += (matrix1[h][g] * matrix2[g][b]);

                }
                matrix3[h][b] = add;



            }
        }

        return matrix3


    }
}


    if (typeof start === 'function') {
        start();
    }
};
