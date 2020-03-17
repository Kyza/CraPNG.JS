function CraPNGException(element, message) {
	console.error("CraPNGExceptionElement:", element);
	throw `CraPNGException: ${message}`;
}

const CraPNG = {
	render: (crapng, display = "inline-block") => {
		if (crapng.tagName.toLowerCase() != "crapng")
			throw new CraPNGException(crapng, `Element is not a CraPNG.`);
		if (!crapng.getAttribute("data-src"))
			throw new CraPNGException(
				crapng,
				`Element requires a "data-src" attribute.\nMake sure you include the "data-src" attribute before adding it to the DOM.`
			);
		if (
			display.toLowerCase() != "inline-block" &&
			display.toLowerCase() != "block"
		)
			throw new CraPNGException(
				crapng,
				`Element display must be one of "inline-block" or "block".`
			);
		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			crapng.style = `display: ${display.toLowerCase()}; width: ${
				img.width
			}px; height: ${img.height}px;`;
			canvas.getContext("2d").drawImage(img, 0, 0, img.width, img.height);
			for (let i = 0; i < img.height; i++) {
				const row = document.createElement("div");
				row.style = `display: inline-block; width: ${img.width}px; height: 1px;`;
				crapng.appendChild(row);
				for (let j = 0; j < img.width; j++) {
					const pixelData = canvas.getContext("2d").getImageData(j, i, 1, 1).data;

					if (pixelData[3] == undefined) pixelData[3] = 255;

					const pixelElement = document.createElement("div");

					pixelElement.style = `display: inline-block; width: 1px; height: 1px; background-color: rgba(${
						pixelData[0]
					}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255});`;

					row.appendChild(pixelElement);
				}
			}
		};
		img.src = crapng.getAttribute("data-src");
	}
};

Object.freeze(CraPNG);
Object.freeze(CraPNGException);

try {
	module.exports.CraPNG = CraPNG;
} catch (e) {}
