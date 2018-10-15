var VFX = {
    getThisEl: () => {
        return document.querySelector(`.${SFCLASS} .vfx`);
    },
    showVFX: () => {
        VFX.getThisEl().style.display = 'block';
    },
    hideVFX: () => {
		VFX.getThisEl().style.display = 'none';
    }
}
