const atcButton = document.getElementById("atc-btn");

const atcButtons = document.querySelectorAll(".atc-btn");

atcButtons.forEach((button) => {
  button.addEventListener("click", async (evt) => {
    try {
      const pid = evt.currentTarget.getAttribute("data-product-id");

      // It adds the product to a hardcoded cart for now.
      await fetch(`/api/carts/65480f5c222663540f177d47/products/${pid}`, {
        method: "POST",
      });
    } catch (error) {
      console.error(error.message);
    }
  });
});
