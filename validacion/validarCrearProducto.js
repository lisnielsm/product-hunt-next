export default function validarCrearProducto(valores) {
    let errores = {};

    // validar el nombre del usuario
    if(!valores.nombre) {
        errores.nombre = "El nombre es obligatorio";
    }

    // validar empresa
    if (!valores.empresa) {
        errores.empresa = "Nombre Empresa es obligatorio";
    }

    // validar URL
    if (!valores.url) {
        errores.url = "La URL del producto es obligatoria";
    }
    else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
        errores.url = "URL mal formateada o no válida";
    }

    // validar el nombre del usuario
    if (!valores.nombre) {
        errores.nombre = "El nombre es obligatorio";
    }

    // validar descripcion
    if (!valores.descripcion) {
        errores.descripcion = "Agrega una descripción de tu producto";
    }
    

    return errores;
}