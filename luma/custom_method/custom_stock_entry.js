frappe.ui.form.on("Stock Entry", {
	refresh: function(doc, dt, dn) {			
		if (this.cur_frm.doc.docstatus===0) {
			// Get Items from Purchase Order
			cur_frm.add_custom_button(__('Get Items from Purchase Order'),
				function() {
				var me = this;
				this.dialog = new frappe.ui.Dialog({
					title: "Get Items from Purchase Order",
					fields: [
						{"fieldtype": "Link", "label": __("Supplier"), "fieldname": "supplier","options":'Supplier',"reqd": 1 },
						{"fieldtype": "Link", "label": __("Items"), "fieldname": "item","options":'Item',"reqd": 1,
							get_query: function() {
								return {
									query:"luma.custom_method.custom_method.filter_items",
									filters:{
										"supplier":cur_dialog.fields_dict.supplier.$input.val()
									},
								}
							}, 
						},
						{"fieldtype": "Button", "label": __("Get"), "fieldname": "get"},
						{"fieldtype": "HTML", "fieldname": "po_items_details"},
					],
					primary_action_label: "ADD",
           			primary_action: function(){
                		add_po_items_to_stock(me.dialog)
                		/*me.hide_dialog()*/
                	}
				});
				me.dialog.show();
				fd = this.dialog.fields_dict;
				this.dialog.fields_dict.get.$input.click(function() {
					value = me.dialog.get_values();
					console.log(value.supplier,"supplier")
					console.log(value.item,"item")
					frappe.call({
						method: "luma.custom_method.custom_method.get_items_from_po",
						args:{
							"supplier":value.supplier,
							"item_code":value.item
						},
						callback: function(r) {
							console.log(r.message)
							if(r.message){
								console.log(r.message.length,"lengthttttttt")
								html = "<table class='table' id='tr-table'><thead><tr class='row'>\
										<td align='center'><b>Item code</b></td>\
										<td align='center'><b>Description</b></td>\
										<td align='center'><b>Purchase Order No.</b></td>\
										<td align='center'><b>Pending QTY</b></td>\
										<td align='center'><b>Price</b></td>\
										<td align='center'><b>Total</b></td>\
										<td align='center'><b>Date Of Purchase</b></td>\
										<td align='center'></td></tr></thead>"
								html +=	"<tbody class='tr-tbody'>"
			  				
			  					for (var i = 0; i <r.message.length; i = i+1) {
									if(r.message[i]['qty'] > 0){
										html+="<tr class='row'>\
										<td align='center'>"+r.message[i]['item_code']+"</td>\
										<td align='center'>"+r.message[i]['description']+"</td>\
										<td align='center'>"+r.message[i]['name']+"</td>\
										<td align='center'>"+r.message[i]['qty']+"</td>\
										<td align='center'>"+r.message[i]['price_list_rate']+"</td>\
										<td align='center'>"+r.message[i]['amount']+"</td>\
										<td align='center'>"+r.message[i]['transaction_date']+"</td>\
										<td align='center'><input type='checkbox' class='select' id='_select' value='"+r.message[i]['name']+"'></td>"
									}
									else if(r.message.length == 1 && r.message[i]['qty'] == 0){
										msgprint("No Pending Qty From Any Purchase Order, Against " + " - "+r.message[i]['item_code']);
									}
								}
	  							html += "</tr></tbody></table>"
  							}
  							$(fd.po_items_details.$wrapper).empty()
		                    $(fd.po_items_details.$wrapper).append(html)
		                    me.dialog.show();
						},
					});
				});
				add_po_items_to_stock = function(){
					var items_to_add = []
		            value = me.dialog.get_values();
		            item_code = value.item;
		            $.each($(fd.po_items_details.wrapper).find(".select:checked"), function(name, item){
		                items_to_add.push($(item).val());
		            });
		            if(items_to_add.length > 0){
		                for(i=0;i<items_to_add.length;i++){
		                	add_po_items(items_to_add,item_code,i)
		            	}
		            	me.dialog.hide()
		            }	
		            else{
		                msgprint("Select Item Before Add")
		            }
				}
			});


			// Get Items from Production Order
			cur_frm.add_custom_button(__('Get Items from Production Order'),
				function() {
				var me = this;
				this.dialog = new frappe.ui.Dialog({
					title: "Get Items from Production Order",
					fields: [
						{"fieldtype": "Link", "label": __("Production Order"), "fieldname": "production_order","options":'Production Order',"reqd": 1, 
							get_query: function() {
								return {
									filters:{
										"docstatus":1
									},
								}
							},
						},
						{"fieldtype": "Button", "label": __("Get"), "fieldname": "get"},
						{"fieldtype": "HTML", "fieldname": "production_order_items_details"},
					],
					primary_action_label: "ADD",
           			primary_action: function(){
                		add_production_order_items_to_stock(me.dialog)
                		/*me.hide_dialog()*/
                	}
				});
				me.dialog.show();
				fd = this.dialog.fields_dict;
				this.dialog.fields_dict.get.$input.click(function() {
					value = me.dialog.get_values();
					console.log(value.production_order,"production_order")
					frappe.call({
						method: "luma.custom_method.custom_method.get_items_from_production_order",
						args:{
							"production_order":value.production_order
						},
						callback: function(r) {
							console.log(r.message)
							if(r.message){
								html = "<table class='table' id='tr-table'><thead><tr class='row'>\
										<td align='center'><b>Item code</b></td>\
										<td align='center'><b>Description</b></td>\
										<td align='center'><b>Production Order No.</b></td>\
										<td align='center'><b>Pending QTY</b></td>\
										<td align='center'><b>Date</b></td>\
										<td align='center'></td></tr></thead>"
								html +=	"<tbody class='tr-tbody'>"
			  				
			  					for (var i = 0; i <r.message.length; i = i+1) {
									if(r.message[i]['qty'] > 0){
										html+="<tr class='row'>\
										<td align='center'>"+r.message[i]['item_code']+"</td>\
										<td align='center'>"+r.message[i]['description']+"</td>\
										<td align='center'>"+r.message[i]['name']+"</td>\
										<td align='center'>"+r.message[i]['qty']+"</td>\
										<td align='center'>"+r.message[i]['date']+"</td>\
										<td align='center'><input type='checkbox' class='select' id='_select' value='"+r.message[i]['name']+"'></td>"
									}
									else if(r.message.length == 1 && r.message[i]['qty'] == 0){
										msgprint("No Pending Qty From Any Production Order, Against " + " - "+r.message[i]['item_code']);
									}
								}
	  							html += "</tr></tbody></table>"
		                	}    
  							$(fd.production_order_items_details.$wrapper).empty()
		                    $(fd.production_order_items_details.$wrapper).append(html)
		                    me.dialog.show();
						},
					});
				});

				add_production_order_items_to_stock = function(){
					var items_to_add = []
		            value = me.dialog.get_values();
		            $.each($(fd.production_order_items_details.wrapper).find(".select:checked"), function(name, item){
		                items_to_add.push($(item).val());
		            });
		            if(items_to_add.length > 0){
		                for(i=0;i<items_to_add.length;i++){
		                	add_production_order_items(items_to_add,i)
		            	}
		            	me.dialog.hide()
		            }	
		            else{
		                msgprint("Select Item Before Add")
		            }
				}
			});
		}
	},
	on_submit: function() {
		update_po = []
		purchase_order_items = {}
		update_production_order = []
		production_order_items = {}
		if(cur_frm.doc.items){
			for(var i = 0 ; i < cur_frm.doc.items.length ; i++){
                if(cur_frm.doc.items[i].purchase_order){
                	purchase_order_items = {
                							'purchase_order':cur_frm.doc.items[i].purchase_order,
                							'item_code':cur_frm.doc.items[i].item_code,
                							'qty':cur_frm.doc.items[i].qty
                						}
                    update_po.push(purchase_order_items);
                }
                if(cur_frm.doc.items[i].production_order){
                	production_order_items = {
                							'production_order':cur_frm.doc.items[i].production_order,
                							'item_code':cur_frm.doc.items[i].item_code,
                							'qty':cur_frm.doc.items[i].qty
                						}
                    update_production_order.push(production_order_items);
                }
            }
		}
		console.log(update_po,"update_po")
		console.log(update_production_order,"update_production_order")
		if(update_po.length > 0){
			updated_custom_received_qty_in_po(update_po)
		}
		if(update_production_order.length > 0){
			updated_custom_manufactured_qty_in_production_order(update_production_order)
		}
	}	
});


add_po_items = function(items_to_add,item_code,i){
	var me = this
	frappe.call({    
		method: "frappe.client.get_list",
	   	args: {
	    	doctype: "Purchase Order Item",
	       	fields: ["item_code","qty","warehouse","uom","stock_uom","conversion_factor","stock_qty","parent","custom_received_qty"],
	       	filters: { "item_code" :item_code,
	       				'parent': items_to_add[i],
	        	},
			},
			callback: function(res){
			if(res && res.message){
				console.log(res.message)
				$.each(res.message, function(i, d) {
					var row = frappe.model.add_child(cur_frm.doc, "Stock Entry Detail", "items");
	                row.item_code = d.item_code;
	                row.qty = d.qty - d.custom_received_qty;
	                row.s_warehouse = d.warehouse;
	                row.uom = d.uom;
	                row.stock_uom = d.stock_uom;
	                row.conversion_factor = d.conversion_factor;
	                row.transfer_qty = d.qty - d.custom_received_qty;
	        		row.purchase_order = d.parent;
	        	})
	        	refresh_field("items");
			}
		}
	});
}

add_production_order_items = function(items_to_add,i){
	var me = this
	frappe.call({    
		method: "frappe.client.get_list",
	   	args: {
	    	doctype: "Production Order",
	       	fields: ["production_item","qty","wip_warehouse","fg_warehouse","stock_uom","name","custom_manufactured_qty"],
	       	filters: { "name" : items_to_add[i]
	        	},
			},
			callback: function(res){
			if(res && res.message){
				console.log(res.message,"add_production_order_items")
				console.log(res.message[0]['production_item'],"production_item")
				var row = frappe.model.add_child(cur_frm.doc, "Stock Entry Detail", "items");
                row.item_code = res.message[0]['production_item'];
                row.qty = res.message[0]['qty'] - res.message[0]['custom_manufactured_qty'];
                row.s_warehouse = res.message[0]['fg_warehouse'];
                row.uom = res.message[0]['stock_uom'];
                row.stock_uom = res.message[0]['stock_uom'];
                row.conversion_factor = 1;
                row.transfer_qty = res.message[0]['qty'] - res.message[0]['custom_manufactured_qty'];
                row.production_order = res.message[0]['name'];
	        	refresh_field("items");
				get_qty_and_item_code_from_bom(items_to_add[i],row.qty,res.message[0]['wip_warehouse'])	
			}
		}
	});
}


get_qty_and_item_code_from_bom = function(production_order,qty,warehouse){
	console.log("in get_qty_and_item_code_from_bom")
	console.log(production_order,"production_order")
	frappe.call({
		async:false,
		method: "frappe.client.get_value",
	   	args: {
	    	doctype: "Production Order",
	       	fieldname: "bom_no",
	       	filters: { name : production_order },
		},
		callback: function(res){
			console.log(res.message,"get_items_from_po")
			if(res && res.message){
				add_bom_items(res.message['bom_no'],qty,production_order,warehouse)
			}
		}
	})	
}


add_bom_items = function(bom,production_order_item_qty,production_order,warehouse){
	console.log(bom,production_order_item_qty,production_order,"in add_bom_items")
	frappe.call({
		async:false,    
		method: "frappe.client.get_list",
	   	args: {
	    	doctype: "BOM Item",
	       	fields: ["item_code","qty","stock_uom"],
	       	filters: { "parent" : bom
	        	},
			},
			callback: function(res){
			if(res && res.message){
				console.log(res.message,"add_bom_items")
				$.each(res.message, function(i, d) {
					var row = frappe.model.add_child(cur_frm.doc, "Stock Entry Detail", "items");
	                row.item_code = d.item_code;
	                row.qty = -(d.qty * production_order_item_qty);
	                row.s_warehouse = warehouse;
	                row.uom = d.stock_uom;
	                row.stock_uom = d.stock_uom;
	                row.conversion_factor = 1;
	                row.transfer_qty = -(d.qty * production_order_item_qty);
	                row.bom_and_production_order = production_order +"-"+bom;
	        	});
	        	refresh_field("items");
			}
		}
	});
}


updated_custom_received_qty_in_po = function(){
	frappe.call({    
		method: "luma.custom_method.custom_method.update_custom_received_qty",
		args: {
			"update_po": update_po,
		},
		callback: function(res){
			console.log(res.message)
			if(res && res.message){
			}
		}	
	});
}


updated_custom_manufactured_qty_in_production_order = function(){
	frappe.call({    
		method: "luma.custom_method.custom_method.update_custom_manufactured_qty",
		args: {
			"update_production_order": update_production_order,
		},
		callback: function(res){
			console.log(res.message)
			if(res && res.message){
			}
		}	
	});
}