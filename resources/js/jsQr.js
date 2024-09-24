// Not in use currently
// Using CDN instead

import { Html5QrcodeScanner } from "html5-qrcode";

function docReady(fn) {
  // see if DOM is already available
  if (document.readyState === "complete"
    || document.readyState === "interactive") {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

docReady(function () {
  function onScanSuccess(decodedText) {

    var emptyAssetBox = findEmptyAssetBox();
    console.log('empty asset box', emptyAssetBox)

    if (emptyAssetBox) {
      // Found an empty asset box, directly set the value
      emptyAssetBox.value = decodedText;
      console.log(`Scan result "${decodedText}" set in existing empty asset box.`);
    } else {
      // No empty asset box found, add a new one
      addAssetBox(decodedText);
      console.log(`Scan result "${decodedText}" added as a new asset box.`);
    }
  }

  function findEmptyAssetBox() {
    const assetBoxes = document.getElementsByName('assetIdentifiers');
    for (var i = 0; i < assetBoxes.length; i++) {
      if (assetBoxes[i].value === '') {
        return assetBoxes[i];
      }
    }
  }

  function addAssetBox(value = '') {
    const assetContainer = document.getElementById('asset-container');
    const assetBoxes = assetContainer.getElementsByClassName('asset-box');

    if (assetBoxes.length < 5) {
      const newAssetBox = `
          <div class="asset-box mb-3">
            <div class="control level is-mobile has-icons-left mb-2">
              <input class="input" type="text" name="assetIdentifiers[]" placeholder="Enter asset number" value="${value}" required>
              <span class="icon is-small is-left">
                <i class="fas fa-pen"></i>
              </span>
              <button class="button is-danger is-light has-text-dark" type="button" onclick="removeAssetBox(this)">
                <i class="fa-regular fa-trash-can"></i>
              </button>
            </div>
          </div>
        `;
      assetContainer.insertAdjacentHTML('beforeend', newAssetBox);
    } else {
      alert("You can add a maximum of 5 assets.");
    }
  }

  var html5QrcodeScanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });
  html5QrcodeScanner.render(onScanSuccess);
});