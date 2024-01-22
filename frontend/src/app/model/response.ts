/** The BackendMsg class represents response from the backend server. This 
 * enforces that all backend endpoints sends the same top level fields. It is 
 * also necessary so that Typescript can give hints. */
export class BackendMsg {
    success: string;
    message: string;
    data: any;  
  }