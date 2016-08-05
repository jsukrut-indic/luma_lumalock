import frappe
import sys
import math

def item_logistic(doc,method):
	# for item in doc.items:
	# 	print frappe.db.get_value("Item",
	# 			 item.item_code,["inner_box_pcs", "outer_box_pcs", "net_weight", "outer_box_code","inner_box_code" ],debug=1)
	try:
		gw = 0

		for item in doc.items:
			inner_box_pcs, outer_box_pcs, net_weight, outer_box_code, inner_box_code = frappe.db.get_value("Item",
						 item.item_code,["inner_box_pcs", "outer_box_pcs", "net_weight", "outer_box_code","inner_box_code" ])

			total_boxes = math.ceil(item.qty / outer_box_pcs) if outer_box_pcs > 0 else 0
			item.total_boxes = total_boxes
			inner_box_pcs = inner_box_pcs if inner_box_pcs > 0 else 0	
			
			if outer_box_code:
				outer_box_weight, outer_box_length, outer_box_width, outer_box_height = frappe.db.get_value("Item", outer_box_code,["net_weight", "length", "width", "height"])
			
				if outer_box_length >= 0 and outer_box_width >=0 and outer_box_height >= 0: 
					total_volume = total_boxes * ( outer_box_length * outer_box_width * outer_box_height)
					item.total_volume = total_volume

				if net_weight >= 0:
					inner_box_weight = frappe.db.get_value("Item", inner_box_code,["net_weight"]) if inner_box_code else 0
					total_weight = (net_weight * item.qty ) + \
									(total_boxes * outer_box_weight) + \
									(total_boxes * (outer_box_pcs / inner_box_pcs) * inner_box_weight)
					item.total_weight = total_weight
			# Actual calculations
			# set calculates values 
			
			
			

	except Exception, e:
		frappe.throw(e)	


def packing_weight(doc,method):
	try:
		gw = 0
		if doc.items:
			for item in doc.items:
				gw += item.total_weight if item.total_weight > 0 else 0
		print gw,"gwwwwwwwwwwwwwwwwwww"		
		doc.gross_weight_pkg = gw
				
		

	except Exception, e:
		frappe.throw(e)
