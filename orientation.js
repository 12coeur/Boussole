window.onload = function() {
    const compassNeedle = document.getElementById("compass-needle");
    const angleDisplay = document.getElementById("angle-display");

    if ("AbsoluteOrientationSensor" in window) {
        try {
            const sensor = new AbsoluteOrientationSensor({ frequency: 10 });

            sensor.addEventListener("reading", () => {
                let q = sensor.quaternion; // [x, y, z, w]
                let angle = Math.atan2(2 * (q[3] * q[2] + q[0] * q[1]), 
                                       1 - 2 * (q[1] * q[1] + q[2] * q[2])) * (180 / Math.PI);

                if (angle < 0) angle += 360; // Normalisation

                // Rotation de l'aiguille
                compassNeedle.style.transform = `rotate(${angle}deg)`;

                // Mise à jour de l'affichage
                angleDisplay.textContent = `Angle: ${angle.toFixed(2)}°`;
            });

            sensor.start();
            console.log("Capteur démarré ✅");

        } catch (e) {
            console.error("❌ Erreur capteur :", e);
            angleDisplay.textContent = "Capteur indisponible ❌";
        }
    } else {
        console.warn("❌ AbsoluteOrientationSensor non supporté");
        angleDisplay.textContent = "Capteur non supporté ❌";
    }
};
