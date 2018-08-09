function Files() {
	$("body").prepend('\
		<div id="tsvDialog">\
			<form>\
			<label>Objects TSV</label><input class="tsvInput" type="text" value="" onpaste="alert();"><br>\
			<label>Morphisms TSV</label><input class="tsvInput" type="text" value=""><br>\
			<button type="button" onclick="files.execute()">OK</button>\
			</form>\
		</div>\
	');
	
	var TSVs = {objects: null, morphisms: null};
	var objectsTSVFileName = "objects.tsv";
	var morphismsTSVFileName = "morphisms.tsv";
	
	/*
	Copy TSVs to dialog
	*/
	this.copyTSVs = function() {
		TSVCode = 0;
		var fields = $("#tsvDialog").children()[0];
		
		//https://www.w3schools.com/xml/xml_http.asp
		var xhttp1 = new XMLHttpRequest();
		xhttp1.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				objectTSVString = xhttp1.responseText;
				fields[0].value = objectTSVString;
				console.log(objectTSVString);
			}
		};
		xhttp1.open("GET", objectsTSVFileName, true);
		xhttp1.send();
		var xhttp2 = new XMLHttpRequest();
		xhttp2.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				morphismTSVString = xhttp2.responseText;
				fields[1].value = morphismTSVString;
				console.log(morphismTSVString);
			}
		};
		xhttp2.open("GET", morphismsTSVFileName, true);
		xhttp2.send();
		
		$("#tsvDialog").css("left", view.canvasWidth/2 - $("#tsvDialog").width()/2);
		$("#tsvDialog").css("top", view.canvasHeight/2 - $("#tsvDialog").height()/2);
		$("#tsvDialog").css("background", TSV_COLOR);
		$("#tsvDialog > form > input").css("background", TSV_INPUT_COLOR);
		$("#tsvDialog > form > input").css("color", "#000000");
		$("#tsvDialog").show();
		fields[0].focus();
	}
	
	/*
	Paste TSVs to dialog
	*/
	this.pasteTSVs = function() {
		TSVCode = 1;
		var objectsHeader = "id"+"\t"+"label"+"\t"+"x"+"\t"+"y"+"\t"+"radius"+"\t"+"selected"+"\t"+"visible"+"\t"+"morphisms"+"\t"+"endomorphisms";
		TSVs.objects = [];
		TSVs.objects.push(objectsHeader);
		for (var i = 0; i < objects.length; i++) {
			var allAtributes = objects[i].getAll();
			TSVs.objects.push(allAtributes[0]+"\t"+allAtributes[1]+"\t"+allAtributes[2]+"\t"+allAtributes[3]+"\t"+allAtributes[4]+"\t"+allAtributes[5]+"\t"+allAtributes[6]+"\t"+allAtributes[7]+"\t"+JSON.stringify(allAtributes[8]));
		}
		var morphismsHeader = "id"+"\t"+"label"+"\t"+"source"+"\t"+"target"+"\t"+"width"+"\t"+"type"+"\t"+"isIdEndomorphism"+"\t"+"selected"+"\t"+"visible"+"\t"+"p0"+"\t"+"p1"+"\t"+"p2"+"\t"+"curve"+"\t"+"handle";
		TSVs.morphisms = [];
		TSVs.morphisms.push(morphismsHeader);
		for (var i = 0; i < morphisms.length; i++) {
			var allAtributes = morphisms[i].getAll();
			TSVs.morphisms.push(allAtributes[0]+"\t"+allAtributes[1]+"\t"+allAtributes[2]+"\t"+allAtributes[3]+"\t"+allAtributes[4]+"\t"+allAtributes[5]+"\t"+allAtributes[6]+"\t"+allAtributes[7]+"\t"+allAtributes[8]+"\t"+allAtributes[9]+"\t"+allAtributes[10]+"\t"+allAtributes[11]+"\t"+allAtributes[12]+"\t"+JSON.stringify(allAtributes[13]));
		}
		objectTSVString = TSVs.objects.join("\n");
		morphismTSVString = TSVs.morphisms.join("\n");
		var fields = $("#tsvDialog").children()[0];
		fields[0].value = objectTSVString;
		fields[1].value = morphismTSVString;
		$("#tsvDialog").css("left", view.canvasWidth/2 - $("#tsvDialog").width()/2);
		$("#tsvDialog").css("top", view.canvasHeight/2 - $("#tsvDialog").height()/2);
		$("#tsvDialog").css("background", TSV_COLOR);
		$("#tsvDialog > form > input").css("background", TSV_INPUT_COLOR);
		$("#tsvDialog > form > input").css("color", "#000000");
		$("#tsvDialog").show();
		fields[0].focus();
	}
	
	this.execute = function () {
		if (TSVCode === 0) {
			var fields = $("#tsvDialog").children()[0];
			TSVs.objects = fields[0].value.split("\n");
			TSVs.morphisms = fields[1].value.split("\n");
			for (var i = 0; i < TSVs.objects.length; i++) {
				console.log(JSON.parse(TSVs.objects[i].substring(TSVs.objects[i].indicesOf("\t").last())));
			}
			console.log(TSVs.objects);
			console.log(TSVs.morphisms);
		} else if (TSVCode === 1) {
			function writeTSV(tsvRows, fileName) {
				var a         = document.createElement("a");
				a.href        = "data:attachment/tsv;charset=utf-8," + encodeURIComponent(tsvRows.join("\n"));
				a.target      = "_blank";
				a.download    = fileName;
				document.body.appendChild(a);
				a.click();
			}
			writeTSV(TSVs.objects.slice(), objectsTSVFileName);
			writeTSV(TSVs.morphisms.slice(), morphismsTSVFileName);
		}
		files.closeTSVInputDialog();
	}
	
	/*
	Get TSVs
	*/
	this.getTSVs = function() {return TSVs;}
	
	/*
	Close TSV input dialog
	*/
	this.closeTSVInputDialog = function () {
		if (selectedElements.length === 0) {
			keyboardMouseStatus = "idle";
			console.log("idle");
		} else {
			keyboardMouseStatus = "idle with element(s) selected";
			console.log("idle with element(s) selected");
		}
		objectTSVString = "";
		morphismTSVString = "";
		TSVCode = -1;$("#tsvDialog").hide();
	}
}