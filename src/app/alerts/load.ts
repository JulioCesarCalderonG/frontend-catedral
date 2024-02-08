import Swal from 'sweetalert2';

export const loadData = (title: string, html: string) => {
  Swal.fire({
    title,
    html,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};
export const closeAlert = () => {
  Swal.close();
};
