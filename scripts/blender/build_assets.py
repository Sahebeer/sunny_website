import argparse
import glob
import math
import os
import sys
from mathutils import Vector

import bpy


def args():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True)
    parser.add_argument("--assets", required=True)
    return parser.parse_args(argv)


OPTIONS = None


def clear():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
        for block in list(datablocks):
            if block.users == 0:
                datablocks.remove(block)


def file_for(kind, suffixes=()):
    matches = glob.glob(os.path.join(OPTIONS.assets, f"{kind}-*"))
    for match in matches:
        if not suffixes or any(match.lower().endswith(suffix) for suffix in suffixes):
            return match
    return None


def principled(name, color, roughness=0.55, metallic=0.0, texture_kind=None):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    nodes = material.node_tree.nodes
    links = material.node_tree.links
    bsdf = nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if texture_kind:
        path = file_for(texture_kind, (".jpg", ".jpeg", ".png"))
        if path:
            image = bpy.data.images.load(path, check_existing=True)
            image.colorspace_settings.name = "sRGB"
            tex = nodes.new("ShaderNodeTexImage")
            tex.image = image
            tex.interpolation = "Linear"
            links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    return material


def emit(name, color, strength=8.0):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Emission Color"].default_value = (*color, 1)
    bsdf.inputs["Emission Strength"].default_value = strength
    bsdf.inputs["Roughness"].default_value = 0.25
    return material


def finish(obj, material, bevel=0.08, smooth=False):
    obj.data.materials.append(material)
    if hasattr(obj.data, "polygons"):
        for poly in obj.data.polygons:
            poly.use_smooth = smooth
    if bevel:
        modifier = obj.modifiers.new("real edge bevel", "BEVEL")
        modifier.width = bevel
        modifier.segments = 3
        modifier.limit_method = "ANGLE"
    if hasattr(obj.data, "uv_layers") and len(obj.data.uv_layers) == 0:
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.mode_set(mode="EDIT")
        bpy.ops.mesh.select_all(action="SELECT")
        bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.03)
        bpy.ops.object.mode_set(mode="OBJECT")
        obj.select_set(False)
    return obj


def cube(name, location, scale, material, bevel=0.08):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(obj, material, bevel)


def cylinder(name, location, radius, depth, material, rotation=(0, 0, 0), bevel=0.05):
    bpy.ops.mesh.primitive_cylinder_add(vertices=32, radius=radius, depth=depth, location=location, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    return finish(obj, material, bevel, True)


def curve_tube(name, points, bevel_depth, material):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = bevel_depth
    curve.bevel_resolution = 4
    spline = curve.splines.new("BEZIER")
    spline.bezier_points.add(len(points) - 1)
    for point, coordinate in zip(spline.bezier_points, points):
        point.co = coordinate
        point.handle_left_type = "AUTO"
        point.handle_right_type = "AUTO"
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    curve.materials.append(material)
    return obj


def mesh_object(name, vertices, faces, material, bevel=0.06):
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    return finish(obj, material, bevel)


def build_station():
    cold = emit("cold fluorescent tubes", (0.78, 0.94, 1.0), 9)
    orange = emit("warm orange livery", (1.0, 0.18, 0.035), 7)
    concrete = principled("weathered concrete", (0.16, 0.2, 0.2), 0.82, 0.05, "concrete")
    metal = principled("painted station metal", (0.22, 0.31, 0.32), 0.46, 0.5, "metal")
    steel = principled("brushed steel", (0.3, 0.4, 0.41), 0.3, 0.78, "steel")
    black = principled("rubber and shadow", (0.006, 0.012, 0.013), 0.6, 0.05)
    white = principled("frosted underside", (0.7, 0.82, 0.82), 0.28, 0.15, "snow")
    yellow = principled("safety yellow", (0.8, 0.54, 0.03), 0.4, 0.2)

    cube("CONCRETE_BASE", (0, -0.3, 0), (12, 0.3, 9), concrete, 0.16)
    cube("CANOPY_MAIN_BEVELED", (0, 7.0, -0.3), (10.5, 0.28, 4.6), metal, 0.22)
    cube("CANOPY_FROSTED_UNDERSIDE", (0, 6.66, -0.3), (10.0, 0.08, 4.2), white, 0.08)
    curve_tube("CANOPY_ORANGE_EDGE", [(-10.3, 7.42, -4.72), (-3.5, 8.65, -4.72), (3.5, 8.65, -4.72), (10.3, 7.42, -4.72)], 0.075, orange)
    for x in (-6.5, 0, 6.5):
        cube("COLD_TUBE_HOUSING", (x, 6.5, -0.2), (2.8, 0.06, 0.22), steel, 0.04)
        cube("COLD_EMISSIVE_TUBE", (x, 6.38, -0.2), (2.45, 0.025, 0.035), cold, 0.02)
    for x in (-8.5, 8.5):
        for z in (-3.75, 3.15):
            cube("PILLAR", (x, 3.2, z), (0.32, 3.2, 0.32), metal, 0.1)
            cylinder("PILLAR_PIPE", (x + 0.34, 3.2, z), 0.065, 5.8, steel, rotation=(0, math.pi / 2, 0), bevel=0.02)
            cube("JUNCTION_BOX", (x + (0.38 if x < 0 else -0.38), 5.0, z), (0.28, 0.38, 0.22), steel, 0.05)
    cube("PUMP_ISLAND", (0, 0.16, -0.65), (6.8, 0.28, 1.65), concrete, 0.16)
    for x in (-3.5, 3.5):
        cube("FUEL_PUMP_BODY", (x, 2.1, -0.65), (1.1, 1.75, 0.72), steel, 0.16)
        cube("PUMP_SCREEN", (x, 2.75, -1.39), (0.75, 0.45, 0.035), black, 0.05)
        cube("PUMP_SCREEN_GLOW", (x, 2.75, -1.44), (0.57, 0.28, 0.012), cold, 0.02)
        cube("RETRO_STRIPE_RED", (x, 1.75, -1.39), (1.0, 0.05, 0.035), orange, 0.02)
        cube("RETRO_STRIPE_YELLOW", (x, 1.6, -1.39), (1.0, 0.05, 0.035), yellow, 0.02)
        for nozzle_x in (-0.42, -0.14, 0.14, 0.42):
            cube("NOZZLE_HANDLE", (x + nozzle_x, 0.85, -1.15), (0.08, 0.55, 0.08), black, 0.03)
            curve_tube("FUEL_HOSE", [(x + nozzle_x, 1.15, -1.23), (x + nozzle_x + 0.8, 0.45, -1.28), (x + nozzle_x + 0.55, 0.3, -1.05)], 0.045, black)
    for x in (-10.8, 10.8):
        cylinder("YELLOW_BOLLARD", (x, 1.05, -3.8), 0.16, 2.1, yellow, bevel=0.05)
    for x in (-4.2, 4.2):
        for z in (-4.6, 4.0):
            cube("SNOW_CAP", (x, 7.42, z), (1.5, 0.12, 0.22), white, 0.14)
    curve_tube("ICICLE_EDGE", [(-7, 6.4, -4.62), (-5.8, 5.9, -4.62), (-4.8, 6.35, -4.62)], 0.05, white)


def build_car():
    body = principled("car dark painted body", (0.012, 0.018, 0.018), 0.2, 0.82, "metal")
    trim = principled("car trim", (0.16, 0.22, 0.22), 0.25, 0.9, "steel")
    glass = principled("smoked glass", (0.018, 0.055, 0.06), 0.08, 0.38)
    rubber = principled("tire rubber", (0.006, 0.008, 0.009), 0.72, 0.02)
    orange = emit("car orange nose strip", (1.0, 0.16, 0.04), 8)
    red = emit("rear red light", (1.0, 0.01, 0.002), 5)

    vertices = [(-5.4, 0.35, -1.25), (-4.2, 1.0, -1.05), (-2.2, 1.2, -1.0), (-0.8, 2.0, -0.9), (1.5, 1.9, -0.85), (3.8, 1.3, -0.9), (5.0, 0.7, -1.1), (5.2, 0.35, -1.25), (-5.4, 0.35, 1.25), (-4.2, 1.0, 1.05), (-2.2, 1.2, 1.0), (-0.8, 2.0, 0.9), (1.5, 1.9, 0.85), (3.8, 1.3, 0.9), (5.0, 0.7, 1.1), (5.2, 0.35, 1.25)]
    faces = [(0, 1, 2, 3, 4, 5, 6, 7), (8, 15, 14, 13, 12, 11, 10, 9), (0, 8, 9, 1), (1, 9, 10, 2), (2, 10, 11, 3), (3, 11, 12, 4), (4, 12, 13, 5), (5, 13, 14, 6), (6, 14, 15, 7), (7, 15, 8, 0)]
    mesh_object("CAR_WEDGE_BODY", vertices, faces, body, 0.16)
    mesh_object("CAR_GLASS_CANOPY", [(-2.4, 1.25, -0.82), (-0.8, 2.12, -0.72), (1.45, 2.03, -0.68), (2.45, 1.35, -0.78), (-2.4, 1.25, 0.82), (-0.8, 2.12, 0.72), (1.45, 2.03, 0.68), (2.45, 1.35, 0.78)], [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)], glass, 0.08)
    curve_tube("CAR_NOSE_LIGHT", [(-5.08, 0.54, -1.21), (-3.8, 0.63, -1.22), (-2.4, 0.68, -1.2)], 0.055, orange)
    curve_tube("CAR_REAR_LIGHT", [(3.5, 0.7, 1.12), (4.55, 0.65, 1.15), (5.0, 0.55, 1.18)], 0.06, red)
    for x in (-3.15, 3.3):
        for z in (-1.08, 1.08):
            cylinder("CAR_RECESSED_WHEEL", (x, 0.42, z), 0.78, 0.34, rubber, rotation=(math.pi / 2, 0, 0), bevel=0.08)
            cylinder("CAR_WHEEL_HUB", (x, 0.42, z + (-0.18 if z < 0 else 0.18)), 0.27, 0.04, trim, rotation=(math.pi / 2, 0, 0), bevel=0.03)
    cube("CAR_SIDE_LIVERY", (-0.5, 0.83, -1.02), (2.8, 0.045, 0.045), orange, 0.02)


def export(name):
    os.makedirs(OPTIONS.output, exist_ok=True)
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.modifier_apply(modifier="real edge bevel") if False else None
    path = os.path.join(OPTIONS.output, name)
    kwargs = dict(filepath=path, export_format="GLB", export_apply=True, export_materials="EXPORT", export_lights=False, export_cameras=False)
    try:
        kwargs["export_draco_mesh_compression_enable"] = True
        kwargs["export_draco_mesh_compression_level"] = 6
        bpy.ops.export_scene.gltf(**kwargs)
    except Exception:
        kwargs.pop("export_draco_mesh_compression_enable", None)
        kwargs.pop("export_draco_mesh_compression_level", None)
        bpy.ops.export_scene.gltf(**kwargs)


def main():
    global OPTIONS
    OPTIONS = args()
    clear()
    build_station()
    export("station.glb")
    clear()
    build_car()
    export("car.glb")


if __name__ == "__main__":
    main()
