window.onload = function() {
    const compassNeedle = document.getElementById("compass-needle");
    const compassAzimut = document.getElementById("compass-azimut");
    const angleDisplay = document.getElementById("angle-display");

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

                // Rotation de l'aiguille dans le sens normal
                compassNeedle.style.transform = `rotate(${angle}deg)`;
                // Rotation de l'azimut dans le MÊME sens que l'aiguille (inversion de la version précédente)
                compassAzimut.style.transform = `rotate(${angle}deg)`;

                let displayedAngle = 360 - angle;
                if (displayedAngle >= 360) displayedAngle -= 360;
                angleDisplay.textContent = `${displayedAngle.toFixed(2)}°`;
                
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
        angleDisplay.textContent = `${angle}°`;
    });
};