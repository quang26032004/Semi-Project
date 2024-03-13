//Global variables

const BASE_API = "https://65f199dc034bdbecc76322b5.mockapi.io/api";
const contentDiv = document.querySelector(".content"); //nếu không có class content thì sẽ trả về null
const createFormDiv = document.querySelector(".create-form"); //nếu không có class content thì sẽ trả về null
const editFormDiv = document.querySelector(".edit-form"); //nếu không có class content thì sẽ trả về null
const detailModalDiv = document.querySelector(".detail-modal"); //nếu không có class content thì sẽ trả về null



const addProductButton = document.getElementById("add-product-button");

//product apis

const getAllProduct = async() =>{
    const res = await fetch(`${BASE_API}/products`);
    return res.json();
}

const getProductById = async (productId) =>{
    const res = await fetch(`${BASE_API}/products/${productId}`);
    return res.json();
}


const createProduct = async (newProduct) =>{
    const res = await fetch(`${BASE_API}/products`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
    });
    return res.ok;
}


const editProduct = async (updatedProduct) => {
    const res = await fetch(`${BASE_API}/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
    });
    return res.ok;
};



const deleteProduct = async (productId) =>{
    const res = await fetch(`${BASE_API}/products/${productId}`, {
        method: 'DELETE'
    })
    return res.ok;
};

//Product features
const generateProductCard = (product, index) => {
    return `
    <div class='product-card'>
        <h2 class='product-index'>${index}</h2>
        <hr />
        <img class='product-image' src='${product.productImage}' />
        <p>Name: ${product.productName}</p>
        <p>Type: ${product.productType}</p>
        <p>Price: ${product.price}</p>
        <div class="actions">
            <button onclick='openProductDetailModal(${JSON.stringify(product.id)})' class= "button-icon">ViewDetail</button>
            <button onclick='openEditProductForm(${JSON.stringify(product)})' class= "button-icon">Edit</button>
            <button onclick='handleDeleteProduct(${JSON.stringify(product.id)})' class= "button-icon">Delete</button>

        </div>

    </div>
    `;
};



//Display data functions or Update DOM functions
const displayProductList = async() => {

    contentDiv.innerHTML = '<h1>Loading....</h1>';

    const productList = await getAllProduct();
    console.log({productList});

    if (productList.length > 0) {
        contentDiv.innerHTML = `
            <div class='product-list'>
                ${
                    productList.map((product, index) => generateProductCard(product, index))
                }
            </div>
        `;
    } else {
        contentDiv.innerHTML = '<h1>No product found</h1>';
    }
};


//show create form
const showCreateProductForm = () => {
    contentDiv.innerHTML = '';
    createFormDiv.style.display = "block";
};

//cancel create form
const handleCancelAdd = () => {
    createFormDiv.style.display = "none";
}

const handleAddProduct = async(event) => {
    event.preventDefault();

    const productName = document.getElementById("product-name").value;
    const productType = document.getElementById("product-type").value;
    const price = document.getElementById("product-price").value;
    const productImage = document.getElementById("product-image").value;
    const isUsed = document.getElementById("is-used").checked;
    const countInStock = document.getElementById("count-in-stock").value;
    const discount = document.getElementById("discount").value;

    const newProduct = {
        productName,
        productType,
        price,
        productImage,
        isUsed,
        countInStock,
        discount
    };

    console.log({newProduct});

    //call createProduct api

    const isCreated = await createProduct(newProduct);

    if (isCreated) {
        alert('Product created successfully');
        location.reload();
    } else {
        alert('Failed to create product');
        location.reload();
    }
};


const handleDeleteProduct = async (productId) => {
    const isDeleted = await deleteProduct(productId);

    if (isDeleted) {
        const productListDiv = document.querySelector(".product-list");
        const errorStatus = document.createElement("h2");
        errorStatus.innerText = "Product deleted successfully";
        errorStatus.style.color = "green";
        productListDiv.appendChild(errorStatus);
        location.reload();
    } else {
        alert('Failed to delete product');
    }
};
const handleEditProductForm = () => {
    const editFormDiv = document.querySelector(".edit-form");

    //set product data to form

    editFormDiv.style.display = "block";
};

const handleCancelEdit = (event) => {
    console.log(event);
    event.preventDefault();
    editFormDiv.style.display = "none";
};


const openEditProductForm =  (selectedProdct) => {
    
    const editFormDiv = document.querySelector(".edit-form");

    document.getElementById("edit-product-name").value = selectedProdct.productName;
    document.getElementById("edit-product-type").value = selectedProdct.productType;
    document.getElementById("edit-product-price").value = selectedProdct.price;
    document.getElementById("edit-product-image").value = selectedProdct.productImage;
    document.getElementById("edit-is-used").checked = selectedProdct.isUsed;
    document.getElementById("edit-count-in-stock").value = selectedProdct.countInStock;
    document.getElementById("edit-discount").value = selectedProdct.discount;

    localStorage.setItem("selected-product-id",  selectedProdct.id);

    editFormDiv.style.display = "block";

    
}


const handleEditProduct = async() => {


    const productName = document.getElementById("edit-product-name").value;
    const productType = document.getElementById("edit-product-type").value;
    const price = document.getElementById("edit-product-price").value;
    const productImage = document.getElementById("edit-product-image").value;
    const isUsed = document.getElementById("edit-is-used").checked;
    const countInStock = document.getElementById("edit-count-in-stock").value;
    const discount = document.getElementById("edit-discount").value;



    const updatedProduct = {
        id: localStorage.getItem("selected-product-id"),
        productName,
        productType,
        price,
        productImage,
        isUsed,
        countInStock,
        discount,
    };

    const isUpdated = await editProduct(updatedProduct);

    if (isUpdated) {

        location.reload();
    } else {
        const editFormDiv = document.querySelector(".edit-form");
        const errorStatus = document.createElement("h2");
        errorStatus.innerText = "Failed to update product";
        errorStatus.style.color = "red";
        editFormDiv.appendChild(errorStatus);

    }
};


const openProductDetailModal = async (selectedproductId) => {
    detailModalDiv.style.display = "block";
    detailModalDiv.innerHTML = '<h2>Loading...</h2>';

    const productDetail = await getProductById(selectedproductId);

    console.log({productDetail});

    detailModalDiv.innerHTML = `
        <div class='product-detail'>
            <h2>Product Detail</h2>
            <img class='product-image' src='${productDetail.productImage}' />
            <p>Name: ${productDetail.productName}</p>
            <p>Type: ${productDetail.productType}</p>
            <p>Price: ${productDetail.price}</p>
            <p>Is Used: <input type='checkbox' ${productDetail.isUsed && "checked"} /></p>
            <p>Count in stock: ${productDetail.countInStock}</p>
            <p>Discount: ${productDetail.discount}%</p>
            <button onclick='closeDetailModal()' class= "close-modal">Close</button>
        
        </div>
    `;
};

const closeDetailModal = () => {
    detailModalDiv.style.display = "none";
};




displayProductList();

