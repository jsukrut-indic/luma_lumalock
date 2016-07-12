frappe.ui.form.on("Item", "onload", function(frm){
	if(!cur_frm.doc.__islocal){
		frappe.call({
			method: "luma.custom_method.custom_method.get_general_enquiry",
			args: {
				item_code: frm.doc.item_code
			},
			callback: function(r) {
				frm.doc.sales_orders = frappe.render_template("sales_order_details", {
					"items": r.message.sales_orders,
				});
				cur_frm.refresh_fields();

				frm.doc.purchase_orders = frappe.render_template("purchase_order_details", {
					"items": r.message.purchase_orders,
				});
				cur_frm.refresh_fields();

				frm.doc.production_orders = frappe.render_template("production_order_details", {
					"items": r.message.production_orders,
				});
				cur_frm.refresh_fields();
			}
		});
	}	
})
