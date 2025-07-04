# Backend Documentation

This document provides an overview of the `backend.py` script, a FastAPI application designed for processing floor plan images to identify, segment, and model architectural elements.

## Overview

The script sets up a web server that exposes a single API endpoint (`/process`). This endpoint accepts an image of a floor plan, processes it through a series of machine learning models to detect walls, rooms, and objects, and generates several output files, including annotated images, GeoJSON polygons, and an IFC 3D model. The service is exposed to the public internet using `ngrok`.

## Features

- **Image Processing:** Accepts PNG or JPG images of floor plans.
- **Object Detection & Segmentation:** Utilizes two YOLO models to perform instance segmentation:
    1.  `wall_segmentor.pt`: Detects and segments wall structures.
    2.  `image_segmentor.pt`: Detects and segments various rooms (e.g., Bedroom, Kitchen) and objects (e.g., Bed, Sofa, Door).
- **Mask Generation:** Creates binary masks for walls, rooms, and objects from the model predictions.
- **Polygon Extraction:** Converts the generated masks into polygonal representations.
- **GeoJSON Output:** Saves the extracted polygons as a GeoJSON file, which is useful for GIS applications.
- **IFC Model Generation:** Creates a 3D model of the floor plan in the Industry Foundation Classes (IFC) format, suitable for use in BIM software.
- **Comprehensive Output:** Bundles all generated artifacts (annotated images, GeoJSON, IFC file) into a single ZIP archive for easy download.

## Dependencies

The script requires the following Python libraries:

- `ultralytics`
- `shapely`
- `opencv-python`
- `matplotlib`
- `geojson`
- `ifcopenshell`
- `tqdm`
- `pyngrok`
- `fastapi`
- `uvicorn`
- `python-multipart`
- `nest_asyncio`

These can be installed via pip:
```bash
pip install ultralytics shapely opencv-python matplotlib geojson ifcopenshell tqdm pyngrok fastapi uvicorn python-multipart nest_asyncio
```

## Models

The application relies on two pre-trained YOLO models, which must be available at the specified paths:
- **Wall Segmentor:** `/content/drive/MyDrive/Trained_Model/wall_segmentor.pt`
- **Image Segmentor:** `/content/drive/MyDrive/Trained_Model/image_segmentor.pt`

*Note: The paths are hardcoded to a Google Drive mount point, which is a common setup in Google Colab environments.*

## API Endpoint

### `POST /process`

This endpoint processes an uploaded floor plan image.

-   **Request:**
    -   **Method:** `POST`
    -   **URL:** `/process`
    -   **Body:** `multipart/form-data` with a single file field.
        -   `image`: The floor plan image file (JPEG or PNG).

-   **Response:**
    -   **Status Code:** `200 OK`
    -   **Content-Type:** `application/x-zip-compressed`
    -   **Body:** A ZIP file named `structify_output.zip` containing the generated files.

## Output Files

The output ZIP file (`structify_output.zip`) contains the following:

-   `wall_detection_annotated.jpg`: The original image with bounding boxes for detected walls.
-   `room_detection_annotated.jpg`: The original image with bounding boxes and masks for detected rooms.
-   `object_detection_annotated.jpg`: The original image with bounding boxes and masks for detected objects.
-   `composite_overlay.jpg`: An image showing the original floor plan with colored overlays for walls (red), rooms (green), and objects (blue).
-   `polygons_output.geojson`: A GeoJSON file containing the polygonal data for all detected elements.
-   `floorplan_model.ifc`: An IFC file representing a 3D model of the floor plan.

## How to Run

1.  **Install Dependencies:** Make sure all the required libraries are installed.
2.  **Set up Models:** Ensure the YOLO model files are located at the correct paths.
3.  **Configure ngrok:** The script uses a hardcoded ngrok authtoken. Replace the placeholder with your own token.
    ```python
    !ngrok authtoken YOUR_NGROK_AUTHTOKEN
    ```
4.  **Run the Server:** Execute the script. It will start a Uvicorn server and use ngrok to create a public URL for the API.
    ```bash
    python backend.py
    ```
5.  **Access the API:** The script will print the public ngrok URL to the console. Use this URL to send requests to the `/process` endpoint.
