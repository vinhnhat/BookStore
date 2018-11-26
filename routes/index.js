var express = require('express');
var router = express.Router();

// import controller
var clr_Book = require('../controllers/book'); 
var clr_Cart = require('../controllers/cart');

/* GET home page. */
router.get('/', clr_Book.get_home_book);
// Xem chi tiết sách
router.get('/chitiet/*-:id', clr_Book.get_detail);
// thêm sách vào cart
router.get('/add-to-cart/:id', clr_Cart.add_to_cart);
// thêm sách vào cart ở trang chitiet (cart2 xử lý soluong)
router.post('/chitiet/*-:id', clr_Cart.add_to_cart2);
// xoá sách
router.get('/deletecart/:id', clr_Cart.delete_cart_item);

// tìm kiếm
router.get('/search', clr_Book.search_book);

// Cart page
router.get('/cart', clr_Cart.get_items_cart);
// Update số lượng sp trong giỏ
router.post("/updatecart", clr_Cart.update_cart);
// Đi đến đặt hàng
router.get("/check_out", clr_Cart.check_out);

// category
//xem sp theo thể loại
router.get("/product/:theloai", clr_Book.show_list_cat);
//xem sp theo đánh dấu
router.get("/dd/:danhdau", clr_Book.show_list_cat2);

module.exports = router;
