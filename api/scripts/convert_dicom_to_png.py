import cv2
import pydicom
import sys

path = sys.argv[1]

dicom = pydicom.dcmread(path, force=True)
img = dicom.pixel_array
cv2.imwrite(path.split('.')[0] + '.png', img)
