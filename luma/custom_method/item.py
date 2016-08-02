import frappe
import sys
import math

def item_logistic(doc,method):
	try:
		gw = 0
		for item in doc.items:
			# item_logistic = frappe.db.get_value("Item", item.item_code,["inner_box_pcs","width", "height", "net_weight", "outer_box_code",
			# 										"inner_box_code"], as_dict=True)

			inner_box_pcs, outer_box_pcs, net_weight, outer_box_code, inner_box_code = frappe.db.get_value("Item",
						 item.item_code,["inner_box_pcs", "outer_box_pcs", "net_weight", "outer_box_code","inner_box_code" ])
	

			# Find weight of Boxes
			inner_box_weight, inner_box_length, inner_box_width, inner_box_height = frappe.db.get_value("Item", inner_box_code,["net_weight", "length", "width", "height"])
			outer_box_weight, outer_box_length, outer_box_width, outer_box_height = frappe.db.get_value("Item", outer_box_code,["net_weight", "length", "width", "height"])
		

			# Actual calculations
			total_boxes = math.ceil(item.qty / outer_box_pcs)
			total_volume = total_boxes * ( outer_box_length * outer_box_width * outer_box_height)
			total_weight = (net_weight * item.qty ) + \
								(total_boxes * outer_box_weight) + \
								(total_boxes * (outer_box_pcs / inner_box_pcs) * inner_box_weight)

		
			# set calculates values 
			item.total_boxes = total_boxes
			item.total_volume = total_volume
			item.total_weight = total_weight

	except Exception, e:
		frappe.throw(e)	

def packing_weight(doc,method):
	try:
		gw = 0
		for item in doc.items:
			gw += item.total_weight
		doc.gross_weight_pkg = gw

	except Exception, e:
		frappe.throw(e)
