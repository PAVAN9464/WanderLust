// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  const locationSearch = document.querySelector('#listing-location-search')

  if (locationSearch) {
    locationSearch.addEventListener('input', () => {
      const params = new URLSearchParams(window.location.search)
      const hasActiveSearch = params.has('location')

      if (!locationSearch.value && hasActiveSearch) {
        params.delete('location')
        const remainingQuery = params.toString()
        const targetUrl = remainingQuery
          ? `${locationSearch.form.action}?${remainingQuery}`
          : locationSearch.form.action
        window.location.assign(targetUrl)
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