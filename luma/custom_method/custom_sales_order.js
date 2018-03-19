
frappe.ui.form.on("Sales Order",{
	refresh:function(frm){
		console.log("HI:")
		if(this.cur_frm.doc.status == "Closed" && this.cur_frm.doc.docstatus === 1 && this.cur_frm.doc.so_closed != "Yes") {
			cur_frm.add_custom_button(__('Make New Sales Order'),function() {
				make_new_so();
			})
		}

		cur_frm.add_custom_button(__('Test'),function() {
				frappe.msgprint("Test")
		})
	}

});

make_new_so = function(){
	frappe.model.open_mapped_doc({
		method: "luma.custom_method.custom_method.make_new_so",
		frm: cur_frm
	})
}
