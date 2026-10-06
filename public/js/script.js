// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  const locationSearch = document.querySelector('#listing-location-search')

  if (locationSearch) {
    locationSearch.addEventListener('input', () => {
      const hasActiveSearch = new URLSearchParams(window.location.search).has('location')

      if (!locationSearch.value && hasActiveSearch) {
        window.location.assign(locationSearch.form.action)
      }
    })
  }

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()