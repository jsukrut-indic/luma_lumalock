import frappe

def item_logistic(doc,method):
	frappe.msgprint("hello")
	print "*********************************"
	items = doc.items
	for i in items:
		print ("item name = ",i.item_name,"\n",
				"Qty = ",i.qty,"\n",
				"Outer_boxes = ",i.outer_boxes)

		item_logistic_query = frappe.db.sql("""select 
												inner_box_pcs,
												outer_box_pcs,
												length,
												width,
												height,
												net_weight,
												outer_box_code,
												inner_box_code
				 from `tabItem`
				 where item_code = %s """, (i.item_code))

		# print item_logistic_query
		outer_boxes = 0
		total_volume = 0
		total_weight = 0
		for row in item_logistic_query:
			inner_box_pcs = row[0]
			outer_box_pcs = row[1]
			length = row[2]
			width = row[3]
			height = row[4]
			net_weight = row[4]
			outer_box_code = row[6]
			inner_box_code =  row[7]

			# Find weight of Boxes
			outer_box_weight_query = frappe.db.sql("""select 
												net_weight
				 from `tabItem`
				 where outer_box_code = %s """, (outer_box_code))
			for row in outer_box_weight_query:
				outer_box_weight = row[0]

			inner_box_weight_query = frappe.db.sql("""select 
												net_weight
				 from `tabItem`
				 where inner_box_code = %s """, (inner_box_code))
			for row in inner_box_weight_query:
				inner_box_weight = row[0]


			# Actual calculations
			outer_boxes = i.qty / outer_box_pcs
			total_volume = outer_boxes * ( length * width * height)
			total_weight = (net_weight * i.qty ) + \
							(outer_boxes * outer_box_weight) + \
							(outer_boxes * (outer_box_pcs / inner_box_pcs) * inner_box_weight)

			print outer_boxes,total_volume,total_weight

			# set calculates values 
			i.outer_boxes = outer_boxes
			i.total_volume = total_volume
			i.total_weight = total_weight





