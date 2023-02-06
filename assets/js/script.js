const init = function () {
	const imagesList = document.querySelectorAll(".gallery__item");
	imagesList.forEach(img => {
		img.dataset.sliderGroupName = Math.random() > 0.5 ? "nice" : "good";
	}); // za każdym przeładowaniem strony przydzielaj inną nazwę grupy dla zdjęcia

	runJSSlider();
};

document.addEventListener("DOMContentLoaded", init);

const runJSSlider = function () {
	const imagesSelector = ".gallery__item";
	const sliderRootSelector = ".js-slider";

	const imagesList = document.querySelectorAll(imagesSelector);
	const sliderRootElement = document.querySelector(sliderRootSelector);

	initEvents(imagesList, sliderRootElement);
	initCustomEvents(imagesList, sliderRootElement, imagesSelector);
};

const initEvents = function (imagesList, sliderRootElement) {
	imagesList.forEach(function (item) {
		item.addEventListener("click", function (e) {
			fireCustomEvent(e.currentTarget, "js-slider-img-click");
		});
	});

	// todo:
	// utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-next]
	// na elemencie [.js-slider__nav--next]
	const navNext = sliderRootElement.querySelector(".js-slider__nav--next");
	navNext.addEventListener("click", function (e) {
		e.stopPropagation();
		fireCustomEvent(e.currentTarget, "js-slider-img-next");
	});

	// todo:
	// utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-prev]
	// na elemencie [.js-slider__nav--prev]
	const navPrev = sliderRootElement.querySelector(".js-slider__nav--prev");
	navPrev.addEventListener("click", function (e) {
		e.stopPropagation();
		fireCustomEvent(e.currentTarget, "js-slider-img-prev");
	});

	// todo:
	// utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-close]
	// tylko wtedy, gdy użytkownik kliknie w [.js-slider__zoom]
	const zoom = sliderRootElement.querySelector(".js-slider__zoom");
	zoom.addEventListener("click", function (e) {
		if (zoom === e.target) {
			fireCustomEvent(sliderRootElement, "js-slider-close");
		}
	});
};

const fireCustomEvent = function (element, name) {
	console.log(element.className, "=>", name);

	const event = new CustomEvent(name, {
		bubbles: true,
	});

	element.dispatchEvent(event);
};

const initCustomEvents = function (
	imagesList,
	sliderRootElement,
	imagesSelector
) {
	imagesList.forEach(function (img) {
		img.addEventListener("js-slider-img-click", function (event) {
			onImageClick(event, sliderRootElement, imagesSelector);
		});
	});

	sliderRootElement.addEventListener("js-slider-img-next", onImageNext);
	sliderRootElement.addEventListener("js-slider-img-prev", onImagePrev);
	sliderRootElement.addEventListener("js-slider-close", onClose);
};

const onImageClick = function (event, sliderRootElement, imagesSelector) {
	// todo:
	// 1. dodać klasę [.js-slider--active], aby pokazać całą sekcję
	sliderRootElement.classList.add("js-slider--active");

	// 2. wyszukać ściężkę (atrybut [src]) do klikniętego elementu i wstawić do [.js-slider__image]
	const clickedImg = event.target;
	console.log(clickedImg);
	const clickedImgSrc = clickedImg.children[0].getAttribute(["src"]);
	const sliderImg = sliderRootElement.querySelector(".js-slider__image");
	sliderImg.setAttribute("src", clickedImgSrc);

	// 3. pobrać nazwę grupy zapisaną w dataset klikniętego elementu
	const clickedImgGroupName = event.target.dataset.sliderGroupName;

	// 4. wyszukać wszystkie zdjęcia należące do danej grupy, które wykorzystasz do osadzenia w dolnym pasku

	const allImgs = document.querySelectorAll(imagesSelector);
	const allImgsArray = Array.from(allImgs);
	const allGroupNameImgs = allImgsArray.filter(function (img) {
		return img.dataset.sliderGroupName === clickedImgGroupName;
	});
	console.log(allGroupNameImgs);

	// 5. utworzyć na podstawie elementu [.js-slider__thumbs-item--prototype] zawartość dla [.js-slider__thumbs]

	const jsSliderThumbsWrapper = sliderRootElement.children[1];
	const jsSliderThumb = sliderRootElement.children[1].children[0];
	console.log(jsSliderThumbsWrapper);

	allGroupNameImgs.forEach(function (item) {
		const jsSliderThumbClone = jsSliderThumb.cloneNode(true);
		jsSliderThumbClone.classList.remove("js-slider__thumbs-item--prototype");

		const itemSrc = item.children[0].getAttribute(["src"]);
		console.log(itemSrc);
		jsSliderThumbClone.children[0].setAttribute("src", itemSrc);
		console.log(jsSliderThumbClone);

		jsSliderThumbsWrapper.appendChild(jsSliderThumbClone);
		console.log(jsSliderThumbsWrapper);
	});

	// 6. zaznaczyć przy pomocy klasy [.js-slider__thumbs-image--current], który element jest aktualnie wyświetlany
	for (let i = 0; i < jsSliderThumbsWrapper.children.length; i++) {
		const sliderImgWrapper = jsSliderThumbsWrapper.children[i];
		const sliderImg = sliderImgWrapper.children[0];
		const sliderImgSrc = sliderImg.getAttribute("src");
		console.log(sliderImgSrc);

		if (clickedImgSrc === sliderImgSrc) {
			sliderImg.classList.add("js-slider__thumbs-image--current");
		}
		console.log(sliderImg);
	}
};

const onImageNext = function (event) {
	console.log(this, "onImageNext");
	// [this] wskazuje na element [.js-slider]

	// todo:
	// 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]

	const currentImg = this.querySelector(".js-slider__thumbs-image--current");
	console.log(currentImg);

	// 2. znaleźć element następny do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]

	const currentFigure = currentImg.parentElement;
	console.log(currentFigure);
	const nextFigure = currentFigure.nextElementSibling;
	console.log(nextFigure);
	const nextImg = nextFigure.firstElementChild;
	console.log(nextImg);

	// 3. sprawdzić czy ten element istnieje - jeśli nie to [.nextElementSibling] zwróci [null]
	if (!nextFigure) {
		return null;
	}
	// 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
	else {
		currentImg.classList.remove(".js-slider__thumbs-image--current");
		nextImg.classList.add(".js-slider__thumbs-image--current");
	}
	// 5. podmienić atrybut o nazwie [src] dla [.js-slider__image]

	const currentSliderImg = this.querySelector(".js-slider__image");
	const currentSliderImgSrc = nextImg.getAttribute("src");
	currentSliderImg.src = currentSliderImgSrc;
};

const onImagePrev = function (event) {
	console.log(this, "onImagePrev");
	// [this] wskazuje na element [.js-slider]

	// todo:
	// 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
	const currentImg = this.querySelector(".js-slider__thumbs-image--current");

	// 2. znaleźć element poprzedni do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]

	const currentFigure = currentImg.parentElement;
	const prevFigure = currentFigure.previousElementSibling;
	const prevImg = prevFigure.firstElementChild;
	console.log(prevImg);

	// 3. sprawdzić czy ten element istnieje i czy nie posiada klasy [.js-slider__thumbs-item--prototype]

	if (
		prevFigure &&
		!prevFigure.classList.contains("js-slider__thumbs-item--prototype")
	) {
		// 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu

		currentImg.classList.remove(".js-slider__thumbs-image--current");
		prevImg.classList.add(".js-slider__thumbs-image--current");
	}
	// 5. podmienić atrybut [src] dla [.js-slider__image]

	const currentSliderImg = this.querySelector(".js-slider__image");
	const prevSliderImgSrc = prevImg.getAttribute("src");
	currentSliderImg.src = prevSliderImgSrc;
};

const onClose = function (event) {
	// todo:
	// 1. należy usunać klasę [js-slider--active] dla [.js-slider]
	// 2. należy usunać wszystkie dzieci dla [.js-slider__thumbs] pomijając [.js-slider__thumbs-item--prototype]
};
