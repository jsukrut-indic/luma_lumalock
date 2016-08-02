// frappe.ui.form.on("Item", "onload", function(frm){
// 	if(!cur_frm.doc.__islocal){
// 		frappe.call({
// 			method: "luma.custom_method.custom_method.get_general_enquiry",
// 			args: {
// 				item_code: frm.doc.item_code
// 			},
// 			callback: function(r) {
// 				frm.doc.sales_orders = frappe.render_template("sales_order_details", {
// 					"items": r.message.sales_orders,
// 				});
// 				cur_frm.refresh_fields();

// 				frm.doc.purchase_orders = frappe.render_template("purchase_order_details", {
// 					"items": r.message.purchase_orders,
// 				});
// 				cur_frm.refresh_fields();

// 				frm.doc.production_orders = frappe.render_template("production_order_details", {
// 					"items": r.message.production_orders,
// 				});
// 				cur_frm.refresh_fields();
// 			}
// 		});
// 	}	
// })

// $.extend(erpnext.item, {
// 	setup_queries: function(frm) {		
// 		frm.fields_dict['Outer Box Code'].get_query = function(doc) {
// 					return {
// 						filters: { "item group": "Box"}
// 					}
// 				}


// 		frm.fields_dict['Inner Box Code'].get_query = function(doc) {
// 					return {
// 						filters: { "item group": "Box"}
// 					}
// 				}
// }

frappe.ui.form.on("Item", {
	refresh: function(frm) {
		frm.fields_dict['outer_box_code'].get_query = function(doc) {
			return {
				filters: { "item_group": "Box"}
			}
		}
		frm.fields_dict['inner_box_code'].get_query = function(doc) {
			return {
				filters: { "item_group": "Box"}
			}
		}
		// if frm.fields_dict['item_group']=="Box" {
		// 	cur_frm.set_df_property("inner_box_code", "reqd", false);
		// 	cur_frm.set_df_property("inner_box_pcs", "reqd", false);
		// 	cur_frm.set_df_property("outer_box_code", "reqd", false);
		// 	cur_frm.set_df_property("outer_box_pcs", "reqd", false);
		// }
	
	
		// eval:doc.item_group=="Box"
		// cur_frm.set_df_property("fieldname", "reqd", true);

	},


});