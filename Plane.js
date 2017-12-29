function Rectangle (height, width, positionX, positionY, velocityX, velocityY, accelerationX, accelerationY, frictionX, frictionY) 
{
	this.height = height;
    this.width = width;
	this.pX = positionX;
    this.pY = positionY;
	this.startpX=positionX;
	this.startpY=positionY;
	this.vX = velocityX;
	this.vY = velocityY;
	this.aX = accelerationX;
	this.aY = accelerationY;
	this.frictionX = frictionX;
	this.frictionY = frictionY;
	this.updateParameters=updateParameters;
	this.nextPosition=nextPosition;
	this.drawRectangle=drawRectangle;
	this.time=0.0;
	this.number=0;
  }
  
  
  
  function updateParameters(positionX=this.pX, positionY=this.pY, velocityX=this.vX, velocityY=this.vY, accelerationX=this.aX, accelerationY=this.aY, height=this.height, width=this.width, frictionX=this.frictionX, frictionY=this.frictionY, time=this.time) 
  {
    this.height = height;
    this.width = width;
	this.pX = positionX;
    this.pY = positionY;
	this.vX = velocityX;
	this.vY = velocityY;
	this.aX = accelerationX;
	this.aY = accelerationY;
	this.frictionX = frictionX;
	this.frictionY = frictionY;
  }
  function nextPosition(dt)
  {
	var frictionSign=null;
this.number+=1;
	  this.time=this.number*dt-0.0001;

	if(this.vX>=0.0 && this.vY>=0.0)
		frictionSign=1.0;
	else if(this.vX<0.0 && this.vY<0.0)
		frictionSign=-1.0;
	if(this.frictionX>this.aX)
		this.frictionX=this.aX;
	if(this.frictionY>this.aY)
		this.frictionY=this.aY;
	  this.vX+=dt*(this.aX-frictionSign*this.frictionX);
	  this.vY+=dt*(this.aY-frictionSign*this.frictionY);
	  this.pX=this.startpX+((this.aX-frictionSign*this.frictionX)*this.time*this.time)/2.0;
	  //this.vX;
	  this.pY=this.startpY+((this.aY-frictionSign*this.frictionY)*this.time*this.time)/2.0;
	  //this.vY;
  }
function drawRectangle(ctx,angle)
{
		ctx.fillStyle="#FF0000";
		ctx.beginPath();
		ctx.moveTo(this.pX,this.pY);

		var nextX=this.pX+Math.cos(angle*Math.PI/180.0)*this.width;
		var nextY=this.pY+Math.sin(angle*Math.PI/180.0)*this.width;
		ctx.lineTo(nextX, nextY);
		nextX=nextX+Math.sin(angle*Math.PI/180.0)*this.height;
		nextY=nextY-Math.cos(angle*Math.PI/180.0)*this.height;
		ctx.lineTo(nextX, nextY);
		nextX=nextX-Math.cos(angle*Math.PI/180.0)*this.width;
		nextY=nextY-Math.sin(angle*Math.PI/180.0)*this.width;
		ctx.lineTo(nextX, nextY);					
		ctx.lineTo(this.pX, this.pY);
		ctx.fill();

}


function valid()
{				
	if ((document.form1.length.value=="")||(document.form1.angle.value==""))
	{
		alert ("Any field can't be empty");
		return false;
	}

	
	else if ((parseFloat(document.form1.length.value)<50)||(parseFloat(document.form1.length.value)>2000))
	{
		alert ("length value must be in [50,2000] ");
		return false;
	}
	else if ((parseFloat(document.form1.angle.value)<0)||(parseFloat(document.form1.angle.value)>90))
	{
		alert ("angle value must be in [0,90] ");
		return false;
	}
	else if ((parseFloat(document.form1.friction.value)<0)||(parseFloat(document.form1.friction.value)>1.0))
	{
		alert ("angle value must be in [0,1] ");
		return false;
	}
	else if ((parseFloat(document.form2.dt.value)<=0)||(parseFloat(document.form2.dt.value)>100))
	{
		alert ("angle value must be in (0,100] ");
		return false;
	}
	else if ((parseFloat(document.form2.Length.value)<=0)||(parseFloat(document.form2.Length.value)>=parseFloat(document.form1.length.value)))
	{
		alert ("Length value must be in (0,Plane Length) ");
		return false;
	}
	else if ((parseFloat(document.form2.Height.value)<0)||(parseFloat(document.form2.Height.value)>200))
	{
		alert ("Height value must be in (0,200] ");
		return false;
	}
	else 
	{
		//alert ("Zapisano pomyĹ›lnie, dziÄ™kujemy :)");
		drawPlane();
		return true;
	}
//draw();
}
var numberOfTask=0;
var topX=0;
var topY=20;
function drawPlane()      
{
	const canvasElem = document.getElementById('canvas');
	const ctx = canvasElem.getContext('2d');
	ctx.clearRect(0, 0, canvasElem.width, canvasElem.height);

	var length=parseFloat(document.form1.length.value);
	var angle=parseFloat(document.form1.angle.value);
	var friction=parseFloat(document.form1.friction.value);
	var dt=parseFloat(document.form2.dt.value);
	var rectLength=parseFloat(document.form2.Length.value);
	var rectHeight=parseFloat(document.form2.Height.value);
	var g =parseFloat(document.form3.g.value);
	/*
	var topX=0;
	var topY=50;
	*/
	var sina=Math.sin(angle*Math.PI/180.0);
	var cosa=Math.cos(angle*Math.PI/180.0);
	topY=rectHeight*cosa+20;
	canvasElem.height=length*sina+rectHeight*cosa+20;
	canvasElem.width=length*cosa+rectHeight*sina+20;
	/*
	body.width=canvasElem.width+250;
	if(body.width<500)
		body.width=500;*/
	//g=9.81;

	var vX=0.0;
	var vY=0.0;

	var bottomX=topX+Math.cos(angle*Math.PI/180.0)*length;
	var bottomY=topY+Math.sin(angle*Math.PI/180.0)*length;

	var rectangle = new Rectangle(rectHeight,rectLength,topX,topY,vX,vY,g*sina*cosa,g*sina*sina,g*cosa*friction*cosa,g*cosa*friction*sina);
	

	var i=0;
	//for(i=0; i<150;i++)
	//while(rectangle.pX <bottomX- Math.cos(angle*Math.PI/180.0)*rectLength  && rectangle.pY < bottomY- Math.sin(angle*Math.PI/180.0)*rectLength)
	//var interval=setInterval(function() {nextTime(bottomX,bottomY,angle,length,rectangle,ctx,canvasElem);if(++i>100) clearInterval(interval);}, 50);
	numberOfTask++;
	var interval=setInterval(function() 
	{
		nextTime(bottomX,bottomY,angle,length,rectangle,ctx,canvasElem,dt);
		if(rectangle.pX >=bottomX- Math.cos(angle*Math.PI/180.0)*rectLength  || rectangle.pY >= bottomY- Math.sin(angle*Math.PI/180.0)*rectLength)
		{
			numberOfTask--;
			if(!document.form1.mute.checked)
				new Audio('cheer.mp3').play();
			clearInterval(interval);
		}
		if(numberOfTask>1)
		{
			numberOfTask--;
			clearInterval(interval);
		}

	}
			, dt*1000);

	
	/*	
	var rectangleTopX=topX;wyczyscil
	var rectangleTopY=topY;
	

	while(rectangleTopX <bottomX- Math.cos(angle*Math.PI/180.0)*rectLength  && rectangleTopY <bottomY- Math.sin(angle*Math.PI/180.0)*rectLength   )
	{
		ctx.clearRect(0, 0, canvasElem.width, canvasElem.height);

		ctx.beginPath();
		ctx.moveTo(topX,topY);
		ctx.lineTo(bottomX,bottomY);
		ctx.stroke();

		rectangleTopX+=Math.cos(angle*Math.PI/180.0);
		rectangleTopY+=Math.sin(angle*Math.PI/180.0);
		
		ctx.moveTo(rectangleTopX,rectangleTopY);
		
		var nextX=rectangleTopX+Math.cos(angle*Math.PI/180.0)*rectLength;
		var nextY=rectangleTopY+Math.sin(angle*Math.PI/180.0)*rectLength;
		ctx.lineTo(nextX, nextY);
		nextX=nextX+Math.sin(angle*Math.PI/180.0)*rectHeight;
		nextY=nextY-Math.cos(angle*Math.PI/180.0)*rectHeight;
		ctx.lineTo(nextX, nextY);
		nextX=nextX-Math.cos(angle*Math.PI/180.0)*rectLength;
		nextY=nextY-Math.sin(angle*Math.PI/180.0)*rectLength;

		ctx.lineTo(nextX, nextY);
		ctx.lineTo(rectangleTopX, rectangleTopY);
		ctx.fill();

	}
			
*/

	
}
function nextTime(bottomX,bottomY,angle,length,rectangle,ctx,canvasElem,dt)
{
	var sina=Math.sin(angle*Math.PI/180.0);
	var cosa=Math.cos(angle*Math.PI/180.0);
	document.getElementById('parametersDiv').innerHTML="time: "+rectangle.time.toFixed(2)+" s"+"<br/>velocity: "+Math.sqrt(rectangle.vX*rectangle.vX+rectangle.vY*rectangle.vY).toFixed(2)+" m/s"+"<br/>acceleration: "+Math.sqrt((rectangle.aX-rectangle.frictionX)*(rectangle.aX-rectangle.frictionX)+(rectangle.aY-rectangle.frictionY)*(rectangle.aY-rectangle.frictionY)).toFixed(2) + " m/s<sup>2</sup>"+"<br/>max coefficient: "+((sina/cosa).toFixed(4));
	ctx.clearRect(0, 0, canvasElem.width, canvasElem.height);
	ctx.fillStyle="#191970";
	ctx.beginPath();
	ctx.moveTo(topX,topY);
	ctx.lineTo(bottomX,bottomY);
	ctx.lineTo(topX,bottomY);
	ctx.fill();
	rectangle.drawRectangle(ctx,angle);
	rectangle.nextPosition(dt);
	//alert(rectangle.pX+" "+ rectangle.pY);


}
function showOptions()
{
	document.getElementById('advancedOptions').style.display= 'block';
}
function hideOptions()
{
	document.getElementById('advancedOptions').style.display= 'none';
}
//wstawic header ktory bedzie cos tam pisal?
//co wstawic do nav?
//do nav mozna wstawic strone "realne przyklady "z video z rownia!
//pierwsza section moze zawierac opcje (wszyskie) i miec 2 article na zwykle opcje i na dodatkowe opcjen
//nastepna section moze zawierac article z canvasem i z  rownia oraz inny article z predkosciami czasem i takimi danymi
//mozna dodac aside element i tam wstawić jakas podstawe fizyczna tego co zrobilismy
//dodac footer z podpisem mailem itp
//ulepszyc mail (jakas ikonka)