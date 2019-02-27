function deleteProduct(btn) {
  const product_id = btn.parentNode.querySelector("[name=product_id]").value;
  const csrfToken = btn.parentNode.querySelector("[name=_csrf]").value;
  const cardProduct = btn.closest('article')

  fetch(`/admin/product/${product_id}`, {
      method: "DELETE",
      headers: {
        "csrf-token": csrfToken
      }
    }).then(res => {
      return res.json()
    }).then(data => {
      console.log(data)
      cardProduct.remove()
    })
    .catch(err => {
      console.log(err)
    })
}