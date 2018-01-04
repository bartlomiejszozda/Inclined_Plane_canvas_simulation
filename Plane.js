//Reprezentuje klocek zjezdzajacy po rowni
function Cuboid (height, width, positionX, positionY, velocityX, velocityY, accelerationX, accelerationY, frictionX, frictionY) 
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
	this.time=0.0;
	this.number=0;
	
	this.updateParameters=updateParameters;
	this.nextPosition=nextPosition;
	this.drawCuboid=drawCuboid;
}
//Sluzy recznemu ustawieniu parametrow, stosowane w testach, pozostawione na wypadek rezszerzania aplikacji
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
//Oblicza i aktualizuje pozycje klocka po kolejnej chwili dt(wybranej przez uzytkownika, lub domyslnie 0.03s).
function nextPosition(dt)
{
	var frictionSign=null;
	this.number+=1;
	this.time=this.number*dt-0.0001;

	// Tarcie dziala przeciwnie do zwrotu predkosci
	if(this.vX>=0.0 && this.vY>=0.0)
	frictionSign=1.0;
	else if(this.vX<0.0 && this.vY<0.0)
	frictionSign=-1.0;

	//Przyspieszenie pochodzace od tarcia nie moze byc wieksze od przyspieszenia klocka 
	if(this.frictionX>this.aX)
	this.frictionX=this.aX;
	if(this.frictionY>this.aY)
	this.frictionY=this.aY;

//aktualizacja polozenia i predkosci klocka
	this.vX+=dt*(this.aX-frictionSign*this.frictionX);
	this.vY+=dt*(this.aY-frictionSign*this.frictionY);
	this.pX=this.startpX+((this.aX-frictionSign*this.frictionX)*this.time*this.time)/2.0;
	this.pY=this.startpY+((this.aY-frictionSign*this.frictionY)*this.time*this.time)/2.0;
}
//Rysuje klocek
function drawCuboid(ctx,angle)
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
//Waliduje wprowadzone przez uzytkownia informacje oraz rozpoczyna ruch klocka
function valid(lang)//dzięki zmiennej lang, program rozpoznaje język strony
{				
	if ((document.form1.length.value=="")||(document.form1.angle.value==""))
	{
		alert ("Any field can't be empty");
		return false;
	}
	else if ((parseFloat(document.form2.Length.value)>=parseFloat(document.form1.length.value))||(parseFloat(document.form1.length.value)>2000))
	{
		alert ("length value must be in (Cuboid length (default 10),2000] ");
		return false;
	}
	else if ((parseFloat(document.form1.angle.value)<=0)||(parseFloat(document.form1.angle.value)>90))
	{
		alert ("angle value must be in (0,90] ");
		return false;
	}
	else if ((parseFloat(document.form1.friction.value)<0))
	{
		alert ("friction value must be greater or equal than 0 ");
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
		runAndDraw(lang);
		return true;
	}
}
//Dzwieki uzywane na stronie
var bells = new Audio('bells.mp3'); 
var cheer = new Audio('cheer.mp3');
//flaga mowiaca, czy klocek zjezdza po rowni
var cuboidSlidingDown= false;

//Pomaga kontolować ilosc uruchamianych i usuwanych symulacji. Minimalna wartosc 0 (aktualnie nie wyswietlamy symulacji), maksymalna wartosc 2(Wyswietlamy symulacje + zadamy nowej symulacji).
var numberOfTask=0;
//Odleglosc wierzcholka rowni, od wierzcholka obiektu canvas
var topX=0;
var topY=20;
//Kontroluje proces wyswietlania zjezdzajacego klocka. 
function runAndDraw(lang)      
{
	if(numberOfTask<=1)//Po zazadaniu kolejnej symulacji w czasie trwania aktualnej, zmienna numberOfTask=2 . Nie rozpoczynamy natychmiast kolejnej symulacji, czekamy az program zakonczy aktualna i sam rozpocznie nowa.
	{
		++numberOfTask;
		const canvasElem = document.getElementById('canvas');
		const ctx = canvasElem.getContext('2d');
		ctx.clearRect(0, 0, canvasElem.width, canvasElem.height);

		//odczytujemy wielkosci wprowadzone przez uzytkownika
		var length=parseFloat(document.form1.length.value);
		var angle=parseFloat(document.form1.angle.value);
		var friction=parseFloat(document.form1.friction.value);
		var dt=parseFloat(document.form2.dt.value);
		var rectLength=parseFloat(document.form2.Length.value);
		var rectHeight=parseFloat(document.form2.Height.value);
		var g =parseFloat(document.form3.g.value);

		//Obliczamy potrzebne wielkosci 
		var sina=Math.sin(angle*Math.PI/180.0);
		var cosa=Math.cos(angle*Math.PI/180.0);
		topY=rectHeight*cosa+20;
		canvasElem.height=length*sina+rectHeight*cosa+20;
		canvasElem.width=length*cosa+rectHeight*sina+20;
		var vX=0.0;
		var vY=0.0;
		//Wspolrzedne prawej dolnej krawedzi rowni
		var bottomX=topX+Math.cos(angle*Math.PI/180.0)*length;
		var bottomY=topY+Math.sin(angle*Math.PI/180.0)*length;

		var cuboid = new Cuboid(rectHeight,rectLength,topX,topY,vX,vY,g*sina*cosa,g*sina*sina,g*cosa*friction*cosa,g*cosa*friction*sina);
		cuboidSlidingDown=true;
		//Obsluga dzwieku (wyciszenie lub podglosnienie) 
		muteUnmute();
		bells.play();
		//Jesli dzwiek sie zakonczyl, oraz klocek wciaz zjezdza, gramy melodie od nowa
		bells.addEventListener('ended', function() {
			if(cuboidSlidingDown)
			{
				this.currentTime = 0;
				this.play();
			}
		}
		, false);
		if(numberOfTask==1)//Jesli numberOfTask==0, to nie mamy czego wyswietlac, jesli numberOfTask==2(czyli zadanie nowej symulacji), to musimy zaczekac az program zakonczy poprzednia symulacje i sam rozpocznie nowa
		{
			calcAndDrawNextPosition(bottomX,bottomY,angle,length,cuboid,ctx,canvasElem,dt,lang);
			var interval=setInterval(function() {
				calcAndDrawNextPosition(bottomX,bottomY,angle,length,cuboid,ctx,canvasElem,dt,lang);//wyswietlamy kolejna klatke ruchu klocka
				if(cuboid.pX >=bottomX- Math.cos(angle*Math.PI/180.0)*rectLength  || cuboid.pY >= bottomY- Math.sin(angle*Math.PI/180.0)*rectLength)//jesli klocek dojechał do konca rowni
				{
					numberOfTask--;
					cuboidSlidingDown=false;
					bells.pause();
					bells.currentTime = 0;
					cheer.play();
					clearInterval(interval);//konczymy działanie setInterval
				}
				//Jesli uzytkownik zada nowej symulacji, to konczymy aktualna i wywolujemy obsluge kolejnej.
				if(numberOfTask>1)
				{
					--numberOfTask;
					clearInterval(interval);
					
					--numberOfTask;
					runAndDraw(lang);
				}
			}
		, dt*1000);//odswiezanie z dokladnoscia dt(zadana przez uzytkownika, lub domyslnie 0.03s)
		}
	}
}
//Czysci canvas a nastepnie rysuje jedna klatke zjezdzajacego klocka. Dodatkowo wypisuje parametry - czas, predkosc, przyspieszenie i wspołczynnik graniczny.
function calcAndDrawNextPosition(bottomX,bottomY,angle,length,cuboid,ctx,canvasElem,dt,lang)
{
	var sina=Math.sin(angle*Math.PI/180.0);
	var cosa=Math.cos(angle*Math.PI/180.0);
	//Wypisujemy parametry w	języku strony
	if(lang==0)
	{
		document.getElementById('parametersArticle').innerHTML="time: "+cuboid.time.toFixed(2)+" s"+"<br/>velocity: "+Math.sqrt(cuboid.vX*cuboid.vX+cuboid.vY*cuboid.vY).toFixed(2)+" m/s"+"<br/>acceleration: "+Math.sqrt((cuboid.aX-cuboid.frictionX)*(cuboid.aX-cuboid.frictionX)+(cuboid.aY-cuboid.frictionY)*(cuboid.aY-cuboid.frictionY)).toFixed(2) + " m/s<sup>2</sup>"+"<br/>max coefficient: "+((sina/cosa).toFixed(4));
	}
	else if (lang==1)
	{
		document.getElementById('parametersArticle').innerHTML="czas: "+cuboid.time.toFixed(2)+" s"+"<br/>prędkość: "+Math.sqrt(cuboid.vX*cuboid.vX+cuboid.vY*cuboid.vY).toFixed(2)+" m/s"+"<br/>przyspieszenie: "+Math.sqrt((cuboid.aX-cuboid.frictionX)*(cuboid.aX-cuboid.frictionX)+(cuboid.aY-cuboid.frictionY)*(cuboid.aY-cuboid.frictionY)).toFixed(2) + " m/s<sup>2</sup>"+"<br/>współczynnik graniczny: "+((sina/cosa).toFixed(4));
	}
	//rysujemy rownie
	ctx.clearRect(0, 0, canvasElem.width, canvasElem.height);
	ctx.fillStyle="#191970";
	ctx.beginPath();
	ctx.moveTo(topX,topY);
	ctx.lineTo(bottomX,bottomY);
	ctx.lineTo(topX,bottomY);
	ctx.fill();
	//rysujemy klocek
	cuboid.drawCuboid(ctx,angle);
	//uplywa czas dt i przesuwamy klocek na kolejna pozyce
	cuboid.nextPosition(dt);
}
//pokazuje dodatkowe wielkosci do wpisania dla uzytkownika
function showOptions()
{
	document.getElementById('advancedOptionsArticle').style.display= 'block';
	document.getElementById('advancedOptionsArticle2').style.display= 'block';
	document.getElementById('moreOptionsButton').style.display= 'none';
	document.getElementById('lessOptionsButton').style.display= 'inline-block';
}
//ukrywa dodatkowe wielkosci do wpisania dla uzytkownika
function hideOptions()
{
	document.getElementById('advancedOptionsArticle').style.display= 'none';
	document.getElementById('advancedOptionsArticle2').style.display= 'none';
	document.getElementById('moreOptionsButton').style.display= 'inline-block';
	document.getElementById('lessOptionsButton').style.display= 'none';
}
//Wycisza / podglasnia dzwiek
function muteUnmute()
{
	if(!document.form1.mute.checked)
	{
		bells.volume=1;
		cheer.volume=1;
	}
	if(document.form1.mute.checked)
	{
		bells.volume=0;
		cheer.volume=0;
	}
}
