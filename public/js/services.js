const homeBtn = document.getElementById('home-btn');
homeBtn.addEventListener('click', function() {
    window.location.href = '/home';
});
function updatePrice(sectionId) {
    const selectElement = document.getElementById(sectionId);
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const sectionIndex = selectElement.getAttribute('data-section');
    const priceElement = document.getElementById(`price${sectionIndex}`);
    const price = selectedOption.getAttribute('data-price');
    priceElement.textContent = `Price: ${price}`;
}

function addToCart(sectionId) {
    const quantityInput = document.getElementById(`quantity${sectionId.slice(-1)}`);
    const quantity = quantityInput.value;
    const sectionIndex = quantityInput.getAttribute('data-section');
    const serviceId = document.getElementById(sectionId).value;

    // Show success message
    const serviceName = document.getElementById(sectionId).options[document.getElementById(sectionId).selectedIndex].text;
    alert(`Quantity ${quantity} of ${serviceName} successfully added to the cart.`);

    // Redirect to cart page
    window.location.href = `/addToCart?serviceId=${serviceId}&quantity=${quantity}`;
}