import frappe

@frappe.whitelist()
def get_general_enquiry(item_code):
	sales_orders_query = """ select so.name, 
					   so.customer, 
					   soi.qty,
					   soi.rate,
					   (soi.qty-soi.delivered_qty) as pending_qty,
					   so.delivery_date 
				from `tabSales Order` so, 
					 `tabSales Order Item` soi 
				where so.name=soi.parent 
					and soi.item_code='%s' and so.docstatus=1"""%(item_code)

	sales_orders = frappe.db.sql(sales_orders_query, as_dict=True)



	purchase_orders_query = """ select po.name,
					   po.supplier,
					   poi.qty,
					   (poi.qty-poi.received_qty) as pending_qty,
					   poi.rate,
					   ((poi.qty-poi.received_qty)*poi.rate) as amount,
					   po.transaction_date
				from `tabPurchase Order` po, 
					 `tabPurchase Order Item` poi 
				where po.name=poi.parent
					and poi.item_code='%s' and po.docstatus=1"""%(item_code)

	purchase_orders = frappe.db.sql(purchase_orders_query, as_dict=True)

	production_orders_query = """ select pro.production_item,
								   pro.description,
								   pro.name,
								   (pro.qty-pro.produced_qty) as pending_qty,
								   pro.planned_start_date
				from `tabProduction Order` as pro 
				where pro.production_item='%s' and pro.docstatus=1 """%(item_code)

	production_orders = frappe.db.sql(production_orders_query, as_dict=True)

	frappe.errprint(purchase_orders)

	return {
		"sales_orders": sales_orders,
		"purchase_orders": purchase_orders,
		"production_orders": production_orders
	}