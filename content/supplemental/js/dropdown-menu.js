(function () {
    const versionDropdownWrapperList = document.querySelectorAll('.version-dropdown');
    versionDropdownWrapperList.forEach(versionDropdownWrapper => {
        const dropdownToggle = versionDropdownWrapper.querySelector('.version-dropdown-toggle');
        const dropdownMenu = versionDropdownWrapper.querySelector('.version-dropdown-menu');
        dropdownToggle.addEventListener('click', function (event) {
            if (dropdownToggle.classList.contains('opened')) {
                dropdownToggle.classList.remove('opened');
                dropdownMenu.classList.remove('opened');
            } else {
                dropdownToggle.classList.add('opened');
                dropdownMenu.classList.add('opened');
            }
        });
    });
})()