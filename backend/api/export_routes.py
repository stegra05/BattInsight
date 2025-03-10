"""
Export routes for BattInsight API.
"""
import io
import csv
import json
import logging
from datetime import datetime
from flask import Blueprint, jsonify, request, send_file
from backend.core.database import get_db_session
from backend.core.models import BatteryData
from backend.services.export_service import get_filtered_data

# Configure logging
logger = logging.getLogger(__name__)

# Create blueprint
export_routes = Blueprint('export_routes', __name__)

@export_routes.route('/csv', methods=['GET'])
def export_csv():
    """Export data as CSV file.
    
    Query parameters:
        Same as data endpoint filters
        
    Returns:
        CSV file download
    """
    try:
        # Get query parameters
        filters = request.args.to_dict()
        
        # Get data from database with filters
        query, data = get_filtered_data(filters)
        
        if not data:
            return jsonify({"error": "No data found matching the filters"}), 404
        
        # Create CSV in memory
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow(['id', 'batt_alias', 'country', 'continent', 'climate', 
                        'iso_a3', 'model_series', 'var', 'val', 'descr', 'cnt_vhcl'])
        
        # Write data
        for item in data:
            writer.writerow([
                item.id,
                item.batt_alias,
                item.country,
                item.continent,
                item.climate,
                item.iso_a3,
                item.model_series,
                item.var,
                item.val,
                item.descr,
                item.cnt_vhcl
            ])
        
        # Prepare response
        output.seek(0)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        return send_file(
            io.BytesIO(output.getvalue().encode('utf-8')),
            mimetype='text/csv',
            as_attachment=True,
            download_name=f'battinsight_export_{timestamp}.csv'
        )
    
    except Exception as e:
        logger.error(f"Error exporting CSV: {str(e)}")
        return jsonify({"error": "Failed to export data"}), 500

@export_routes.route('/json', methods=['GET'])
def export_json():
    """Export data as JSON file.
    
    Query parameters:
        Same as data endpoint filters
        
    Returns:
        JSON file download
    """
    try:
        # Get query parameters
        filters = request.args.to_dict()
        
        # Get data from database with filters
        query, data = get_filtered_data(filters)
        
        if not data:
            return jsonify({"error": "No data found matching the filters"}), 404
        
        # Convert data to list of dictionaries
        result = []
        for item in data:
            result.append({
                'id': item.id,
                'batt_alias': item.batt_alias,
                'country': item.country,
                'continent': item.continent,
                'climate': item.climate,
                'iso_a3': item.iso_a3,
                'model_series': item.model_series,
                'var': item.var,
                'val': item.val,
                'descr': item.descr,
                'cnt_vhcl': item.cnt_vhcl
            })
        
        # Prepare response
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        return send_file(
            io.BytesIO(json.dumps(result, indent=2).encode('utf-8')),
            mimetype='application/json',
            as_attachment=True,
            download_name=f'battinsight_export_{timestamp}.json'
        )
    
    except Exception as e:
        logger.error(f"Error exporting JSON: {str(e)}")
        return jsonify({"error": "Failed to export data"}), 500

@export_routes.route('/excel', methods=['GET'])
def export_excel():
    """Export data as Excel file.
    
    Query parameters:
        Same as data endpoint filters
        
    Returns:
        Excel file download
    """
    try:
        # Check if pandas and openpyxl are available
        try:
            import pandas as pd
        except ImportError:
            return jsonify({"error": "Excel export requires pandas and openpyxl"}), 500
        
        # Get query parameters
        filters = request.args.to_dict()
        
        # Get data from database with filters
        query, data = get_filtered_data(filters)
        
        if not data:
            return jsonify({"error": "No data found matching the filters"}), 404
        
        # Convert data to list of dictionaries
        result = []
        for item in data:
            result.append({
                'id': item.id,
                'batt_alias': item.batt_alias,
                'country': item.country,
                'continent': item.continent,
                'climate': item.climate,
                'iso_a3': item.iso_a3,
                'model_series': item.model_series,
                'var': item.var,
                'val': item.val,
                'descr': item.descr,
                'cnt_vhcl': item.cnt_vhcl
            })
        
        # Create DataFrame
        df = pd.DataFrame(result)
        
        # Create Excel in memory
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='BatteryData')
        
        # Prepare response
        output.seek(0)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=f'battinsight_export_{timestamp}.xlsx'
        )
    
    except Exception as e:
        logger.error(f"Error exporting Excel: {str(e)}")
        return jsonify({"error": "Failed to export data"}), 500
