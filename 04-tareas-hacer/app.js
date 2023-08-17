require('colors');

const { guardarDB, leerDB } = require('./helpers/guardarArchivo.js');
const { inquirerMenu,
        pausa,
        leerInput,
        listadoTareasBorrar,
        confirmar,
        mostrarListadoChecklist
} = require('./helpers/inquirer');
const Tareas = require('./models/tareas');


const main = async() => {

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if ( tareasDB ){

        tareas.cargarTareasFromArray(tareasDB);

    }
    //await pausa();

    do {

        //Imprimir el menu
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                //crear tarea
                const desc = await leerInput('Descripción:');
                tareas.crearTarea( desc );
            break;
            case '2':
                //listar tarea
                tareas.listadoCompleto();
            break;
            case '3':
                //listar tareas completadas
                tareas.listarPendientesCompletadas(true);
            break;
            case '4':
                //listar tareas pendientes
                tareas.listarPendientesCompletadas(false);
            break;
            case '5':
                //completar tareas
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas(ids);
            break;
            case '6':
                //borrar tareas
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if ( id !== '0'){
                    const ok = await confirmar('¿Está seguro?');
                    if( ok ){
                        tareas.borrarTarea( id );
                        console.log('Tarea borrada');
                    }
                }

            break;
            case '7':
                //salir
            break;
            
        }
        
        guardarDB( tareas.listadoArr );

        await pausa();

    } while ( opt !== '0' );

    //pausa();

}

main();