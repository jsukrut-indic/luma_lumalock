$.extend(frappe.treeview_settings["BOM"], {
	get_tree_nodes: 'luma.custom_method.custom_method.get_bom_children',
	onrender: function(node) {
		var bom_qty_html = '<div class="pull-right text-muted small">\
				<div class="text-right bom-qty %(label_class)s">%(stock)s</div>\
				<div class="text-right bom-qty %(label_class)s">%(qty)s</div>';
		
		if(node.root) {
			var qty_obj = {stock:"Balance Qty", qty:"Qty to Receive", label_class:"bom-label"};
			$(repl(bom_qty_html, qty_obj)).insertBefore(node.$ul);
		
		}else if(!node.data.expandable){
			var qty_obj = {stock:node.data.stock, qty:node.data.remaining_qty, label_class:""};
			$(repl(bom_qty_html, qty_obj)).insertBefore(node.$ul);
		}
	
	},
})