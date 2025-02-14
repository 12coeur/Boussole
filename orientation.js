window.onload = function() {
    const compassNeedle = document.getElementById('compass-needle');
    const orientationInfo = document.getElementById('orientation-info');

    if ('DeviceOrientationEvent' in window) {
        window.addEventListener('deviceorientation', function(event) {
            console.log('API DeviceOrientation accessible');

            // Récupérer uniquement la valeur de l'axe Z (alpha)
            const alphaValue = event.alpha; // Rotation autour de l'axe z (0 à 360 degrés)

            // Mettre à jour l'aiguille de la boussole
            if (alphaValue !== null) {
                compassNeedle.style.transform = `translateX(-50%) rotate(${alphaValue}deg)`;
            }

            // Afficher la valeur de l'axe Z sous l'aiguille
            orientationInfo.textContent = `${alphaValue.toFixed(2)}°`;
        });
    } else {
        console.log('API DeviceOrientation non supportée par ce navigateur');
        orientationInfo.textContent = "API non disponible";
    }
};