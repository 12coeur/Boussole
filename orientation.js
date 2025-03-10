// orientation.js modifié
window.onload = function() {
    const compassNeedle = document.getElementById("compass-needle");
    const angleDisplay = document.getElementById("angle-display");
    const azimutBackground = document.getElementById("azimut-background");

    if ("AbsoluteOrientationSensor" in window) {
        try {
            const sensor = new AbsoluteOrientationSensor({ frequency: 10 });
            sensor.addEventListener("reading", () => {
                const declinaison = 3.8;
                let q = sensor.quaternion;
                let angle = Math.atan2(2 * (q[3] * q[2] + q[0] * q[1]), 
                                     1 - 2 * (q[1] * q[1] + q[2] * q[2])) * (180 / Math.PI);
                if (angle < 0) angle += 360;
                angle += declinaison;

                compassNeedle.style.transform = `rotate(${angle}deg)`;
                let displayedAngle = 360 - angle;
                if (displayedAngle >= 360) displayedAngle -= 360;
                angleDisplay.textContent = `${displayedAngle.toFixed(2)}°`;
                updateAzimutBackground(displayedAngle);
                
                // Événement pour que NordF.html récupère l'angle
                window.dispatchEvent(new CustomEvent("angle-updated", { detail: displayedAngle.toFixed(2) }));
            });
            sensor.start();
        } catch (e) {
            console.error("❌ Erreur capteur :", e);
            angleDisplay.textContent = "Capteur indisponible ❌";
        }
    } else {
        console.warn("❌ AbsoluteOrientationSensor non supporté");
        angleDisplay.textContent = "Capteur non supporté ❌";
    }
	


    window.addEventListener("angle-updated", function(event) {
        const angle = Math.round(event.detail);
        document.getElementById("angle-display").textContent = `${angle}°`;
        updateAzimutBackground(angle);
    });
	
	function updateAzimutBackground(angle) {
    let translateX = -angle * 10; // 10 pixels par degré
    azimutBackground.style.transform = `translateX(${translateX}px)`;
}
};
