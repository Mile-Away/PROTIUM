from accounts.models import ArithmeticAccess
from asgiref.sync import sync_to_async
from bohrium_open_sdk import OpenSDK

from ..models import WorkflowNode
from ..typed import BohriumJobCallbackTyped, BohriumJobConfigProps


@sync_to_async
def submit_bohrium_job(
    node: WorkflowNode, dir_path: str, config: BohriumJobConfigProps
) -> BohriumJobCallbackTyped:

    try:
        arithmetic = ArithmeticAccess.objects.get(user=node.workflow.creator)
        access_token = arithmetic.bohrium_access_token

        print(">>>>>>>>>>>>>>>>>> Bohrium Access Key: ", access_token)

        if access_token is None:
            raise ArithmeticAccess.DoesNotExist
    except ArithmeticAccess.DoesNotExist:
        raise ValueError("Bohrium access token is None, Please add it in settings.")

    try:
        client = OpenSDK(access_key=access_token)

        details = client.job.submit(
            work_dir=dir_path,
            project_id=config["project_id"],
            job_name=config["job_name"],
            machine_type=config["machine_type"],
            cmd=config["command"],
            image_address=config["image_address"],
            dataset_path=[],
            log_files=[],
            out_files=[],
        )

    except SystemExit:

        try:
            client = OpenSDK(access_key=access_token, app_key="protium")

            details = client.job.submit(
                work_dir=dir_path,
                project_id=config["project_id"],
                job_name=config["job_name"],
                machine_type=config["machine_type"],
                cmd=config["command"],
                dataset_path=[],
                image_address=config["image_address"],
                log_files=[],
                out_files=[],
            )
        except SystemExit:
            raise Exception("Bohrium Job Submit Failed")

    if details is None or details.get("code") != 0:
        raise Exception("Bohrium Job Submit Failed")

    return details
